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

function enviarImagem() {
  if (!imagemFacial.value) {
    alert("Por favor, capture sua imagem facial.");
    return false;
  }
  return true;
}
