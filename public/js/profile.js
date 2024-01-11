(function () {
  fetch("/current")
    .then((res) => res.json())
    .then((data) => {
      const htmlText = `<p>Nombre: ${data.firstname}</p>
            <p>Apellido: ${data.lastname} </p>
            <p>Email: ${data.email}</p>`;
      const span = document.getElementById("profile-span");
      span.innerHTML = htmlText;
    })
    .catch((error) => console.error("error", error));
})();
