(function () {
  const buyButton = document.getElementById("comprarBtn");
  const emptyButton = document.getElementById("vaciarBtn");
  const deleteButton = document.getElementById("btnDelete");

  emptyButton.addEventListener("click", (ev) => {
    ev.preventDefault();
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
          `Your cart ${emptyButton.dataset.cartId} has been empty.`,
          "success"
        );
        let idToDelete;
        idToDelete = emptyButton.dataset.cartid
        try {
          fetch(`/api/carts/${idToDelete}`,
            {
              method: "DELETE"
            }).then(res => {
              if (res.status === 200) {
                window.location.reload()
              }
            }).then(data => {
              console.log(data)
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

  deleteButton?.addEventListener("click", (ev) => {
    ev.preventDefault();
    const productDelete = deleteButton.dataset.deleteid
    const cartId = emptyButton.dataset.cartid
    try {
      fetch(`/api/carts/${cartId}/product/${productDelete}`,
        {
          method: "DELETE"
        }).then(res => {
          if (res.status === 200) {
            window.location.reload()
          }
        }).then(data => {
          console.log(data)
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error)
    }
  });

  buyButton?.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const cartId = buyButton.dataset.cartid;
    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST"
      });
      const data = await response.json();
      alert(JSON.stringify(data));
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  });
})();
