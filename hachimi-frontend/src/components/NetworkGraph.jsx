import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';

const NetworkGraph = ({ elements, height = '400px' }) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Biến đổi dữ liệu từ dạng Cytoscape sang dạng ForceGraph
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];
    
    // Tạo Set để track ID node (tránh lặp)
    const nodeIds = new Set();
    
    elements.forEach(el => {
      if (el.data.source && el.data.target) {
        // Parse score từ label (VD: "96.5%")
        const scoreStr = (el.data.label || '').replace('%', '');
        const score = parseFloat(scoreStr) / 100 || 0.5;

        // Đây là Edge (Link) chính
        links.push({
          source: el.data.source,
          target: el.data.target,
          label: el.data.label,
          type: 'main_link',
          score: score
        });
      } else if (el.data.id) {
        // Đây là Node chính
        if (!nodeIds.has(el.data.id)) {
          nodeIds.add(el.data.id);
          nodes.push({
            id: el.data.id,
            label: el.data.label,
            type: el.data.type
          });
        }
      }
    });

    // Thêm các hạt li ti (Dummy Particles) bao quanh dựa trên Điểm Dự Đoán (Score)
    // Duyệt qua từng liên kết chính để tạo tinh vân
    let particleCounter = 0;
    const mainLinks = links.filter(l => l.type === 'main_link');
    
    mainLinks.forEach(mainLink => {
      // Số lượng hạt tỷ lệ thuận với điểm dự đoán (score)
      const numParticles = Math.floor(mainLink.score * 300);
      
      for (let i = 0; i < numParticles; i++) {
        const pId = `particle_${particleCounter++}`;
        const isBridge = Math.random() < 0.3; // 30% là cầu nối
        
        // Chọn ngẫu nhiên host là source hoặc target của link này
        const isHostSource = Math.random() < 0.5;
        const hostId = isHostSource ? mainLink.source : mainLink.target;
        
        // Xác định màu dựa trên host (giả sử source là Bệnh, target là Thuốc, hoặc ngược lại)
        // Tìm node thực tế để lấy type màu
        const hostNode = nodes.find(n => n.id === hostId);
        
        nodes.push({
          id: pId,
          label: '',
          type: 'particle',
          particleType: isBridge ? 'bridge' : (hostNode ? hostNode.type : 'drug')
        });
        
        if (isBridge) {
          // Nối với cả source và target của link này
          links.push({ source: pId, target: mainLink.source, type: 'particle_link' });
          links.push({ source: pId, target: mainLink.target, type: 'particle_link' });
        } else {
          // Xoay quanh host
          links.push({ source: pId, target: hostId, type: 'particle_link' });
        }

        // Thi thoảng nối các hạt với nhau tạo mạng lưới đan xen
        if (i > 0 && Math.random() < 0.3) {
          links.push({ source: pId, target: `particle_${particleCounter - 2}`, type: 'particle_link' });
        }
      }
    });
    
    return { nodes, links };
  }, [elements]);

  // Handle Container Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Xoay camera tự động ban đầu
  useEffect(() => {
    if (fgRef.current) {
      let angle = 0;
      const interval = setInterval(() => {
        angle += Math.PI / 800; // Tốc độ xoay chậm vừa phải
        fgRef.current.cameraPosition({
          x: 400 * Math.cos(angle),
          z: 400 * Math.sin(angle)
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative" 
      style={{ height, width: '100%', backgroundColor: '#f8fafc' }}
    >
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#f8fafc"
        
        // Node customization
        nodeVal={(node) => {
          if (node.type === 'particle') return 1; // Hạt to hơn một chút để dễ nhìn trên nền sáng
          if (node.type === 'center') return 40;
          if (node.type === 'disease') return 30;
          return 25; // drug
        }}
        nodeColor={(node) => {
          if (node.type === 'particle') {
            if (node.particleType === 'disease') return 'rgba(251, 113, 133, 0.6)'; // Hồng đỏ nhạt
            if (node.particleType === 'bridge') return 'rgba(168, 85, 247, 0.4)'; // Tím nhạt
            return 'rgba(59, 130, 246, 0.6)'; // Blue nhạt
          }
          if (node.type === 'center') return '#2563eb'; // Blue đậm
          if (node.type === 'disease') return '#e11d48'; // Đỏ đậm
          return '#3b82f6'; // Blue
        }}
        nodeOpacity={1}
        
        // Label trên Node (SpriteText 3D)
        nodeThreeObject={(node) => {
          if (node.type === 'particle') return null; // Không hiện chữ cho hạt
          const sprite = new SpriteText(node.label);
          sprite.color = '#0f172a'; // Chữ màu tối
          sprite.textHeight = 10;
          sprite.fontFace = 'Inter, sans-serif';
          sprite.fontWeight = 'bold';
          // Kéo chữ nhích lên một chút khỏi tâm để không bị che bởi khối cầu
          sprite.position.y = 20; 
          return sprite;
        }}
        nodeThreeObjectExtend={true} // Giữ lại khối cầu, chỉ thêm text
        
        // Cấu hình Links (Edges)
        linkWidth={(link) => link.type === 'particle_link' ? 0.3 : 1}
        linkColor={(link) => link.type === 'particle_link' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'} 
        // Số lượng hạt sáng chạy trên link phụ thuộc vào score
        linkDirectionalParticles={(link) => link.type === 'particle_link' ? 0 : Math.max(2, Math.floor((link.score || 0.5) * 8))} 
        linkDirectionalParticleColor={() => '#8b5cf6'} 
        // Tốc độ hạt sáng cũng phụ thuộc vào score
        linkDirectionalParticleSpeed={(link) => link.type === 'particle_link' ? 0 : 0.002 + (link.score || 0.5) * 0.008}
        linkDirectionalParticleWidth={3}
        linkDirectionalArrowLength={0} // Bỏ mũi tên thô
        linkDirectionalArrowRelPos={1}
        
        // Tương tác
        enableNodeDrag={true}
        onNodeClick={(node) => {
          // Khi click vào 1 node, camera sẽ zoom sát vào nó
          const distance = 150;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, 
            node, 
            2000  // transition duration (ms)
          );
        }}
      />
      <div className="absolute bottom-6 left-6 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200 pointer-events-none flex items-center gap-2 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
        Tương tác: Cuộn để Zoom - Kéo thả để Xoay
      </div>
    </div>
  );
};

export default NetworkGraph;
