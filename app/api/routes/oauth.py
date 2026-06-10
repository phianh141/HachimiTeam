import secrets

import httpx
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.orm import Session
from starlette.config import Config
from starlette.requests import Request 

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, hash_password
from app.models.models import User

router = APIRouter(prefix="/auth", tags=["OAuth"])

config = Config(environ={
    "GOOGLE_CLIENT_ID": settings.google_client_id,
    "GOOGLE_CLIENT_SECRET": settings.google_client_secret,
})
oauth = OAuth(config)
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        userinfo = token.get("userinfo")
        if not userinfo:
            raise HTTPException(status_code=400, detail="Không lấy được thông tin từ Google")

        email = userinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Google account không có email")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            username = email.split("@")[0]
            # Kiểm tra username đã tồn tại chưa
            if db.query(User).filter(User.username == username).first():
                username = f"{username}_gg"
            user = User(
                username=username,
                email=email,
                password=hash_password(secrets.token_hex(16)),
                role="user",
                is_active=1,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token({"sub": str(user.user_id), "role": user.role})
        redirect_url = (
            f"{settings.frontend_url}/oauth/callback"
            f"?token={access_token}&username={user.username}"
        )
        return RedirectResponse(url=redirect_url, status_code=302)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {str(e)}")

@router.get("/github/login")
async def github_login():
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.github_client_id}&scope=user:email"
    )
    return RedirectResponse(url)


@router.get("/github/callback")
async def github_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Thiếu authorization code")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_resp.raise_for_status()
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Không lấy được GitHub access token")

        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_resp.raise_for_status()
        github_user = user_resp.json()

        email = github_user.get("email")
        if not email:
            emails_resp = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            emails_resp.raise_for_status()
            emails = emails_resp.json()
            primary = next((e for e in emails if e.get("primary")), None)
            email = primary.get("email") if primary else (emails[0].get("email") if emails else None)

    if not email:
        raise HTTPException(status_code=400, detail="GitHub account không có email")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        username = github_user.get("login", email.split("@")[0])
        if db.query(User).filter(User.username == username).first():
            username = f"{username}_gh"

        user = User(
            username=username,
            email=email,
            password=hash_password(secrets.token_hex(16)),
            role="user",
            is_active=1,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = create_access_token({"sub": str(user.user_id), "role": user.role})
    redirect_url = (
        f"{settings.frontend_url}/oauth/callback"
        f"?token={jwt_token}&username={user.username}"
    )
    return RedirectResponse(redirect_url)
