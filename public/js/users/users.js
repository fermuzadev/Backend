(function () {
    const deleteUserButtons = document.querySelectorAll(".btnDelete");
    const userRole = document.querySelectorAll(".user")
    const adminRole = document.querySelectorAll(".admin")
    const premiumRole = document.querySelectorAll(".premium")


    deleteUserButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            let userId = button.dataset.userid;
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
                        `The user ${userId} has been deleted.`,
                        "success"
                    );
                    try {
                        fetch(`/api/user/${userId}`,
                            {
                                method: "DELETE"
                            }).then(res => {
                                if (res.status === 204) {
                                    window.location.reload()
                                }
                            }).then(data => {
                                console.log(data)
                            })
                            .catch(err => console.log(err));
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    console.log(`The action was cancelled`);
                    return;
                }
            });
        });
    });

    userRole.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            let userId = button.dataset.userid;
            try {
                fetch(`/api/user/${userId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ role: "user" })
                    }).then(res => {
                        if (res.status === 204) {
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
    });

    adminRole.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            let userId = button.dataset.userid;
            try {
                fetch(`/api/user/${userId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ role: "admin" })
                    }).then(res => {
                        if (res.status === 204) {
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
    });

    premiumRole.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            let userId = button.dataset.userid;
            try {
                fetch(`/api/user/${userId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ role: "premium" })
                    }).then(res => {
                        if (res.status === 204) {
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
    });
})();