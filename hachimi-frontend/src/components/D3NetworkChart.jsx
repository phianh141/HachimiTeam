import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3NetworkChart = ({ diseaseName, topDrugs }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!diseaseName || !topDrugs || topDrugs.length === 0) return;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    const width = wrapperRef.current ? wrapperRef.current.clientWidth : 200;
    const height = wrapperRef.current ? wrapperRef.current.clientHeight : 200;

    const nodes = [
      { id: diseaseName, group: 'disease', radius: 18 },
      ...topDrugs.map(d => ({ id: d.drug_name, group: 'drug', radius: 10, score: d.score }))
    ];

    const links = topDrugs.map(d => ({
      source: diseaseName,
      target: d.drug_name,
      value: d.score
    }));

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .style('width', '100%')
      .style('height', '100%');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => d.radius + 15));

    // Draw links
    const link = svg.append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.max(1, d.value * 4));

    // Draw nodes
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.group === 'disease' ? '#e11d48' : '#3b82f6')
      .call(drag(simulation));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('dy', d => d.radius + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#475569')
      .attr('font-weight', '500')
      .text(d => {
        // truncate long names
        const text = d.id;
        return text.length > 10 ? text.substring(0, 8) + '..' : text;
      });

    simulation.on('tick', () => {
      // Keep nodes within bounds with padding
      const padding = 20;
      nodes.forEach(d => {
        d.x = Math.max(padding, Math.min(width - padding, d.x));
        d.y = Math.max(padding, Math.min(height - padding, d.y));
      });

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
        
      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag behavior function
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [diseaseName, topDrugs]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[150px] flex items-center justify-center">
      <svg ref={svgRef} className="cursor-move"></svg>
    </div>
  );
};

export default D3NetworkChart;
