(function () {
    const addProductToCartButtons = document.querySelectorAll(".addToCart");
    addProductToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            let cartId = document.querySelector("[data-cartid]").dataset.cartid;
            console.log('cartId', cartId);
            let productId = button.dataset.productid;
            console.log(productId);
            try {
                fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST"
                }).then((response) => {
                    if (response.ok) {
                        alert("Product added to cart");
                        response.json();
                    }
                }).then((data) => {
                    window.location.href = `/cart/${cartId}`;
                    console.log(data);
                }).catch((error) => {
                    console.log(error);
                });
            } catch (error) {
                console.log(error);
            }
        });
    });
})();
