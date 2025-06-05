import Parse from 'parse';

Parse.initialize("YOUR_APP_ID", "YOUR_JAVASCRIPT_KEY");
Parse.serverURL = 'https://parseapi.back4app.com/';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const imagemFacial = document.getElementById('imagemFacial');
const preview = document.getElementById('preview');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    alert("Não foi possível acessar a câmera.");
  });

function capturar() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const dataURL = canvas.toDataURL('image/png');
  imagemFacial.value = dataURL;
  preview.src = dataURL;
}

async function enviarImagem() {
  const form = document.getElementById('formCadastro');
  const formData = new FormData(form);

  if (!imagemFacial.value) {
    alert("Por favor, capture sua imagem facial.");
    return false;
  }

  try {
    const parseFile = new Parse.File('imagemFacial.png', { base64: imagemFacial.value.split(',')[1] });
    await parseFile.save();

    const Usuario = Parse.Object.extend('Usuario');
    const usuario = new Usuario();
    usuario.set('nome', formData.get('nome'));
    usuario.set('serie', formData.get('serie'));
    usuario.set('email', formData.get('email'));
    usuario.set('cpf', formData.get('cpf'));
    usuario.set('foto', parseFile);

    await usuario.save();
    alert("Cadastro realizado com sucesso!");
    form.reset();
    preview.src = '';
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    alert("Erro ao enviar dados.");
  }

  return false;
}
