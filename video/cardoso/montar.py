"""Monta cardoso-baterias-video.html (arquivo único) a partir de modelo.html,
embutindo a logo original, o raio da marca e as fontes."""
import base64, pathlib
aqui = pathlib.Path(__file__).resolve().parent
img = aqui.parent.parent / "assets" / "img"
def uri(caminho, tipo):
    return f"data:{tipo};base64," + base64.b64encode(caminho.read_bytes()).decode()
trocas = {
    "{{LOGO}}": uri(img / "logo-fundo-escuro.png", "image/png"),
    "{{RAIO}}": uri(img / "raio-transparente.webp", "image/webp"),
    "{{ANTON}}": uri(aqui / "fontes" / "anton-latin-400-normal.woff2", "font/woff2"),
    "{{MONT600}}": uri(aqui / "fontes" / "montserrat-latin-600-normal.woff2", "font/woff2"),
    "{{MONT800}}": uri(aqui / "fontes" / "montserrat-latin-800-normal.woff2", "font/woff2"),
}
html = (aqui / "modelo.html").read_text(encoding="utf-8")
for k, v in trocas.items():
    html = html.replace(k, v)
(aqui / "cardoso-baterias-video.html").write_text(html, encoding="utf-8")
print("ok:", aqui / "cardoso-baterias-video.html")
