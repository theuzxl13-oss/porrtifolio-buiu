"""Monta os arquivos únicos cardoso-baterias-video.html (em pé) e cardoso-site-video.html
(deitado, para o site) a partir dos modelos,
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
# modelo -> arquivo final
for origem, destino in [("modelo.html", "cardoso-baterias-video.html"), ("modelo-site.html", "cardoso-site-video.html")]:
    html = (aqui / origem).read_text(encoding="utf-8")
    for k, v in trocas.items():
        html = html.replace(k, v)
    (aqui / destino).write_text(html, encoding="utf-8")
    print("ok:", aqui / destino)
