(function () {
  fetch("/api/current")
    .then((res) => res.json())
    .then((data) => {
      const htmlText = `<p>Nombre: ${data.firstname}</p>
            <p>Apellido: ${data.lastname} </p>
            <p>Email: ${data.email}</p>
            <p>Rol: ${data.role}</p>`;
      const span = document.getElementById("profile-span");
      span.innerHTML = htmlText;
    })
    .catch((error) => console.error("error", error));
})
fetch('/api/admin')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  ();
