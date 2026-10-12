// Gera cardoso-baterias.mp4 quadro a quadro (sem depender de tempo real).
// Uso: NODE_PATH=$(npm root -g) node gerar-mp4.cjs [--previa 3,10,19.6]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const aqui = __dirname;
const html = "file://" + path.join(aqui, "cardoso-baterias-video.html");
const saida = path.join(aqui, "cardoso-baterias.mp4");
const previa = process.argv.indexOf("--previa");

(async () => {
  const navegador = await chromium.launch({
    executablePath: process.env.CHROMIUM || undefined,
    args: ["--autoplay-policy=no-user-gesture-required"]
  });
  const pagina = await navegador.newPage();
  pagina.on("pageerror", e => { console.error("Erro na página:", e.message); process.exitCode = 1; });
  await pagina.goto(html);
  await pagina.evaluate(() => window.VIDEO.pronto);

  if (previa > 0) { // só alguns quadros em PNG, para conferir
    for (const t of process.argv[previa + 1].split(",").map(Number)) {
      const png = await pagina.evaluate(t => { window.VIDEO.render(t); return document.getElementById("tela").toDataURL("image/png"); }, t);
      fs.writeFileSync(path.join(process.env.PREVIA_DIR || aqui, `quadro-${t}.png`), Buffer.from(png.split(",")[1], "base64"));
    }
    await navegador.close(); return;
  }

  const wav = path.join(require("os").tmpdir(), "cardoso-audio.wav");
  fs.writeFileSync(wav, Buffer.from(await pagina.evaluate(() => window.VIDEO.gerarWav()), "base64"));
  console.log("som pronto");

  const { DUR, FPS } = await pagina.evaluate(() => ({ DUR: window.VIDEO.DUR, FPS: window.VIDEO.FPS }));
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-i", wav,
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-tune", "grain", "-pix_fmt", "yuv420p", "-profile:v", "high",
    "-r", String(FPS), "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", saida], { stdio: ["pipe", "inherit", "inherit"] });

  const total = Math.round(DUR * FPS);
  const inicio = Date.now();
  for (let i = 0; i < total; i++) {
    const jpg = await pagina.evaluate(t => { window.VIDEO.render(t); return document.getElementById("tela").toDataURL("image/jpeg", 0.96); }, i / FPS);
    const buf = Buffer.from(jpg.split(",")[1], "base64");
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 75 === 0) console.log(`quadro ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((ok, erro) => ff.on("close", c => c === 0 ? ok() : erro(new Error("ffmpeg saiu com " + c))));
  await navegador.close();
  console.log(`MP4 pronto em ${((Date.now() - inicio) / 1000).toFixed(0)}s: ${saida}`);
})().catch(e => { console.error(e); process.exit(1); });
