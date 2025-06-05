const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const preview = document.getElementById('preview');
const form = document.getElementById('userForm');

// Ativa a câmera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Erro ao acessar a câmera:", err);
    alert("Não foi possível acessar a câmera.");
  });

// Captura imagem do vídeo e exibe preview
captureButton.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  const imageData = canvas.toDataURL('image/jpeg');
  preview.src = imageData;
  preview.style.display = 'block';
  preview.dataset.image = imageData;
});

// Envio do formulário com imagem
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const imageBase64 = preview.dataset.image || '';

  const json = {
    nome: formData.get("nome"),
    email: formData.get("email"),
    cpf: formData.get("cpf"),
    serie: formData.get("serie"),
    imagemfacial: imageBase64
  };

  try {
    const res = await fetch('http://localhost:8080/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(json)
    });

    if (res.ok) {
      alert("Dados enviados com sucesso!");
      form.reset();
      preview.style.display = 'none';
    } else {
      alert("Erro ao enviar os dados.");
      console.error(await res.text());
    }
  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("Erro na conexão com o servidor.");
  }
});
