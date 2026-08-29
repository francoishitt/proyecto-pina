import { prisma } from "@/lib/prisma";
export type SocialVideo={id:string;platform:"TIKTOK"|"INSTAGRAM";title:string;coverUrl?:string|null;videoUrl?:string|null;embedUrl?:string|null;permalink?:string|null;createdAt?:string|null};

async function refreshTikTok(c:any){
  if(!c.refreshToken)return c;
  if(c.tokenExpiresAt&&c.tokenExpiresAt.getTime()>Date.now()+60*60*1000)return c;
  const body=new URLSearchParams({client_key:process.env.TIKTOK_CLIENT_KEY||"",client_secret:process.env.TIKTOK_CLIENT_SECRET||"",grant_type:"refresh_token",refresh_token:c.refreshToken});
  const r=await fetch("https://open.tiktokapis.com/v2/oauth/token/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Cache-Control":"no-cache"},body,cache:"no-store"});
  if(!r.ok){console.error("TikTok refresh error",r.status,await r.text());return c}
  const j=await r.json();
  return prisma.conexionSocial.update({where:{plataforma:"TIKTOK"},data:{accessToken:j.access_token,refreshToken:j.refresh_token||c.refreshToken,tokenExpiresAt:new Date(Date.now()+(j.expires_in||86400)*1000),scope:j.scope||c.scope}})
}

async function refreshInstagram(c:any){
  if(c.tokenExpiresAt&&c.tokenExpiresAt.getTime()>Date.now()+7*24*3600*1000)return c;
  const u=new URL("https://graph.instagram.com/refresh_access_token");u.searchParams.set("grant_type","ig_refresh_token");u.searchParams.set("access_token",c.accessToken);
  const r=await fetch(u,{cache:"no-store"});if(!r.ok)return c;const j=await r.json();
  return prisma.conexionSocial.update({where:{plataforma:"INSTAGRAM"},data:{accessToken:j.access_token||c.accessToken,tokenExpiresAt:new Date(Date.now()+(j.expires_in||5184000)*1000)}})
}

async function videosTikTok(c:any,limit:number):Promise<SocialVideo[]>{
  const out:SocialVideo[]=[];
  const objetivo=Math.max(1,Math.min(100,limit));
  let cursor:number|undefined;
  let hasMore=true;
  while(hasMore&&out.length<objetivo){
    const maxCount=Math.min(20,objetivo-out.length);
    const body:any={max_count:maxCount};if(cursor)body.cursor=cursor;
    const url="https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,embed_link,share_url,create_time";
    const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${c.accessToken}`,"Content-Type":"application/json"},body:JSON.stringify(body),cache:"no-store"});
    if(!r.ok){console.error("TikTok video.list error",r.status,await r.text());break}
    const j=await r.json();
    for(const v of j.data?.videos||[])out.push({id:`tt-${v.id}`,platform:"TIKTOK",title:v.title||v.video_description||"Video de TikTok",coverUrl:v.cover_image_url,embedUrl:v.embed_link,permalink:v.share_url,createdAt:v.create_time?new Date(v.create_time*1000).toISOString():null});
    hasMore=Boolean(j.data?.has_more);cursor=j.data?.cursor;
    if(!cursor)hasMore=false;
  }
  return out;
}

export async function obtenerVideosSociales(limit=12):Promise<SocialVideo[]>{
  try{
    const conns=await prisma.conexionSocial.findMany();const out:SocialVideo[]=[];
    for(let c of conns){
      try{
        if(c.plataforma==="TIKTOK"){
          c=await refreshTikTok(c);out.push(...await videosTikTok(c,limit));
        }else if(c.plataforma==="INSTAGRAM"){
          c=await refreshInstagram(c);const u=new URL("https://graph.instagram.com/me/media");u.searchParams.set("fields","id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");u.searchParams.set("limit",String(Math.min(100,limit)));u.searchParams.set("access_token",c.accessToken);
          const r=await fetch(u,{cache:"no-store"});if(r.ok){const j=await r.json();for(const v of j.data||[])out.push({id:`ig-${v.id}`,platform:"INSTAGRAM",title:v.caption||"Publicación de Instagram",coverUrl:v.thumbnail_url||v.media_url,videoUrl:v.media_type==="VIDEO"?v.media_url:null,permalink:v.permalink,createdAt:v.timestamp||null})}else console.error("Instagram media error",r.status,await r.text());
        }
      }catch(e){console.error("social feed",c.plataforma,e)}
    }
    return out.sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).slice(0,limit)
  }catch(e){console.error("obtenerVideosSociales",e);return []}
}
