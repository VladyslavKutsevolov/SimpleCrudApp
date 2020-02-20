$(document).ready(() => {
  $(".delete-article").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/article/" + id,
      success: function(res) {
        alert("Deleting article");
        window.location.href = "/";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
