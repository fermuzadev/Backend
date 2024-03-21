(function () {
    const roleButton = document.getElementByClass("roleBtn");
    const deleteButton = document.querySelectorAll(".btnDelete");

    deleteButton.addEventListener("click", (ev) => {
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
                    `The user ${emptyButton.dataset.cartId} has been deleted.`,
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

})();