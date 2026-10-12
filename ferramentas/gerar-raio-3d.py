# Gera o raio 3D (SVG) do topo e o insere no index.html.
# Uso: python3 ferramentas/gerar-raio-3d.py index.html
# Ajuste D (profundidade) e as cores abaixo para mudar o visual.
import math, re, sys
P=[(262,18),(84,346),(196,346),(128,612),(338,236),(222,236),(306,18)]
D=(-46,30)   # profundidade: parede visível à esquerda/embaixo
def path(pts,dx=0,dy=0): return "M"+" L".join(f"{x+dx:.1f} {y+dy:.1f}" for x,y in pts)+" Z"
# área com sinal para saber a orientação
area=sum(P[i][0]*P[(i+1)%7][1]-P[(i+1)%7][0]*P[i][1] for i in range(7))/2
luz=(0.55,-0.85)  # luz vinda de cima/direita
faces=[]
for i in range(7):
    a=P[i]; b=P[(i+1)%7]
    ex,ey=b[0]-a[0],b[1]-a[1]; L=math.hypot(ex,ey)
    nx,ny=(ey/L,-ex/L) if area>0 else (-ey/L,ex/L)   # normal para fora
    vis=nx*D[0]+ny*D[1]  # >0: parede voltada para o lado da profundidade (visível)
    if vis<=0: continue
    br=max(0,nx*luz[0]+ny*luz[1])
    quad=[a,b,(b[0]+D[0],b[1]+D[1]),(a[0]+D[0],a[1]+D[1])]
    faces.append((quad,br,i,(nx,ny)))
grads=[];polys=[]
for quad,br,i,(nx,ny) in faces:
    # cor: parede iluminada por dentro (vidro âmbar), mais quente quanto mais luz
    c1=f"rgb({255},{int(70+90*br)},{int(10+40*br)})"
    c2=f"rgb({int(110+60*br)},{int(14+20*br)},{int(8+10*br)})"
    gid=f"raio-lado{i}"
    a,b,c,d=quad
    grads.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{(a[0]+b[0])/2:.0f}" y1="{(a[1]+b[1])/2:.0f}" x2="{(c[0]+d[0])/2:.0f}" y2="{(c[1]+d[1])/2:.0f}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>')
    polys.append(f'<path d="{path(quad)}" fill="url(#{gid})" stroke="{c1}" stroke-width="1" stroke-linejoin="round"/>')
front=path(P)
back=path(P,*D)
veios=[ "M268 40 L232 120 L250 128 L196 236 L214 240 L150 330",
        "M300 30 L262 132 L276 140 L238 220",
        "M318 250 L262 330 L276 336 L198 452 L210 458 L150 560",
        "M290 262 L246 330" ]
svg=f'''<svg class="ilustra ilustra--raio" viewBox="-70 -80 520 780">
            <defs>
              <linearGradient id="raio-borda" x1="0" y1="0" x2=".3" y2="1">
                <stop offset="0" stop-color="#fff1dc"/><stop offset=".35" stop-color="#ffb066"/><stop offset=".75" stop-color="#ff5a1a"/><stop offset="1" stop-color="#ff1a00"/>
              </linearGradient>
              <radialGradient id="raio-vidro" cx=".55" cy=".42" r=".75">
                <stop offset="0" stop-color="#5a1c0c"/><stop offset=".45" stop-color="#2a0d14"/><stop offset="1" stop-color="#120a1c"/>
              </radialGradient>
              <linearGradient id="raio-reflexo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ffffff" stop-opacity=".28"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".04"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
              </linearGradient>
              {"".join(grads)}
              <clipPath id="raio-forma"><path d="{front}"/></clipPath>
              <filter id="raio-brilho" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="raio-veio" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="raio-interno" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
              <filter id="raio-nevoa" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1100" height="1400"><feGaussianBlur stdDeviation="34"/></filter>
            </defs>
            <ellipse class="raio__halo" cx="210" cy="330" rx="170" ry="300" fill="#ff4a10" opacity=".22" filter="url(#raio-nevoa)"/>
            <ellipse cx="150" cy="660" rx="190" ry="34" fill="#6b21ef" opacity=".45" filter="url(#raio-nevoa)"/>
            <ellipse cx="130" cy="640" rx="110" ry="22" fill="#ff3d00" opacity=".55" filter="url(#raio-nevoa)"/>
            <g class="raio__corpo">
              <path d="{back}" fill="#2a0806"/>
              <g filter="url(#raio-veio)">{"".join(polys)}</g>
              <path d="{front}" fill="url(#raio-vidro)"/>
              <g clip-path="url(#raio-forma)">
                <path d="M262 18 L84 346 L150 346 L290 30 Z" fill="url(#raio-reflexo)"/>
                <path d="M338 236 L222 236 L180 330 Z" fill="#ffffff" opacity=".07"/>
                <path d="{front}" fill="none" stroke="#ff5a1a" stroke-width="44" opacity=".55" filter="url(#raio-interno)"/>
                <path d="M286 34 L176 296 L256 300 L150 590" fill="none" stroke="#ffb066" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".55" filter="url(#raio-interno)"/>
                <path d="M286 34 L176 296 L256 300 L150 590" fill="none" stroke="#fff1dc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".5" filter="url(#raio-veio)"/>
              </g>
              <path class="raio__borda" d="{front}" fill="none" stroke="url(#raio-borda)" stroke-width="6" stroke-linejoin="round" filter="url(#raio-brilho)"/>
              <path d="{front}" fill="none" stroke="#fff1dc" stroke-width="1.4" stroke-linejoin="round" opacity=".9"/>
            </g>
            <g class="raio__faisca" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#raio-brilho)">
              <polyline points="296,20 312,-6 300,-14 322,-40 310,-48 336,-78" stroke="#8fc8ff" stroke-width="4"/>
              <polyline points="312,-6 330,-20 326,-30" stroke="#8fc8ff" stroke-width="2.5"/>
              <polyline points="296,20 312,-6 300,-14 322,-40 310,-48 336,-78" stroke="#ffffff" stroke-width="1.5"/>
            </g>
          </svg>'''
p=sys.argv[1]; s=open(p).read()
a=s.index('<svg class="ilustra ilustra--raio"'); b=s.index('</svg>',a)+6
s=s[:a]+svg+s[b:]

open(p,'w').write(s)
print(len(faces),"paredes visíveis")
