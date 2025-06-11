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

  // Atualiza o input hidden para enviar junto no form (opcional)
  document.getElementById('imagemFacial').value = imageData;
});

// Envio do formulário com validação
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.querySelector('input[name="nome"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const serie = document.querySelector('input[name="serie"]').value.trim();
  const imageBase64 = preview.dataset.image || '';

  // Validação dos campos
  if (!nome || !email || !serie || !imageBase64) {
    alert("Por favor, preencha todos os campos e capture a foto.");
    return;
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  const json = {
    nome,
    email,
    serie,
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
      window.location.href = 'sucesso.html';
    } else {
      alert("Erro ao enviar os dados.");
      console.error(await res.text());
    }
  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("Erro na conexão com o servidor.");
  }
});
