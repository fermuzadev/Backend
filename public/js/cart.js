(function () {
  const socket = io();
  let carts = [];
  const buyButton = document.getElementById("comprarBtn");
  const emptyButton = document.getElementById("vaciarBtn");
  const deleteButton = document.getElementsByClassName("btnDelete");
  const price = document.getElementById("price");
  const quantity = document.getElementById("quantity");
  const stock = document.getElementById("stock");
  const productsListSocket = document.getElementById("productsSocket");

  emptyButton.addEventListener("click", (ev) => {
    ev.preventDefault();
    console.log('aprete el boton')
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Deleted!",
          `Your cart ${emptyButton.dataset.cartId} has been deleted.`,
          "success"
        );
        let idToDelete;
        idToDelete = emptyButton.dataset.cartid
        try {
          fetch(`http://localhost:8080/api/carts/${idToDelete}`,
            {
              method: "DELETE"
            }).then(res => res.json()).then(res => {
              window.location.reload()
            })
            .catch(err => console.log(err));
        } catch (error) {
          console.log(error)
        }
        // socket.emit("idToDelete", idToDelete);
      } else {
        console.log(`The action was cancelled`);
        return;
      }
    });
  });

  // form.addEventListener("click", (ev) => {
  //   ev.preventDefault();
  //   try {
  //     products.push({
  //       title: title.value,
  //       description: description.value,
  //       code: code.value,
  //       price: price.value,
  //       stock: stock.value,
  //       category: category.value,
  //       thumbnails: thumbnails.file,
  //     });
  //     socket.emit("productSocket", products);
  //     showProductSocket(products);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // });

  // function showProductSocket(products) {
  //   productsListSocket.innerHTML = "";
  //   products.forEach((product) => {
  //     const prod = document.createElement("div");
  //     prod.className = "card";
  //     prod.innerHTML = `  
  //       <img src=${product.thumbnails} class="card-img-top" alt="...">
  //       <div class="card-body">
  //         <h5 class="card-title">Product Title: ${product.title}</h5>
  //         <p class="card-text">ID: ${product._id}</p>
  //         <p class="card-text">CODE: ${product.code}.</p>
  //         <p class="card-text">Description: ${product.description}.</p>
  //         <p class="card-text">Price: ${product.price}.</p>
  //         <p class="card-text">Category${product.category}.</p>
  //         <p class="card-text"><small class="text-muted">Stock: ${product.stock}</small></p>
  //       </div>`;
  //     productsListSocket.appendChild(prod);
  //   });
  // }
  //Show realTime Products

  // socket.on("products", (...products) => {
  //   showProductSocket(products);
  // });

  //Reception Events from Backend

  // socket.on("message_everyone", (message) => {
  //   console.log("message_everyone", message);
  // });
})();
