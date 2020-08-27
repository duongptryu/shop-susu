var utc = new Date().toJSON().slice(0, 10); // lấy ngày tháng năm hiện tại 

document.addEventListener("DOMContentLoaded", () => {
  const date = document.querySelector("#date");
  date.setAttribute("value", utc);

  date.onchange = () => {
    if (window.location.pathname === "/import") {
      changeData(window.location.pathname);
    }
    if (window.location.pathname === "/export") {
      changeData(window.location.pathname);
    }
  };
});

function changeData(path) {
  const date = document.querySelector("#date").value;
  var xhttp = new XMLHttpRequest();
  let link = "";
  if (path === "/import") {
    link = "/import/update/";
  }
  if (path === "/export") {
    link = "/export/update/";
  }
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const datas = JSON.parse(this.responseText);
      let blockCode = "";
      document.querySelector("#totalKg").innerHTML =
        "Total: " + datas.bill + " Bill";
      document.querySelector("#totalMoney").innerHTML =
        "Total Money: " + datas.totalMoney + " VNĐ";
      document.querySelector("#totalPaid").innerHTML =
        "Total Money Paid: " + datas.totalPaid + " VNĐ";
      document.querySelector("#totalUnpaid").innerHTML =
        "Total Money Unpaid: " + datas.totalUnpaid + " VNĐ";
      if (datas.result.length > 0) {
        document.querySelector("#data-query").innerHTML = "";
        datas.result.forEach((data) => {
          blockCode +=
            "<tr><th scope='row'>" +
            data.name +
            "</th><td>" +
            data.address +
            "</th><td>" +
            data.amount +
            "</td><td>" +
            data.price +
            " VNĐ</td><td>" +
            data.total +
            " VNĐ</td><td>" +
            data.paid +
            "<td><a href='" +
            link +
            data._id +
            "'>Update</a></td><td><a href='#' class='delete' data-setname='" +
            data.name +
            "' data-setid ='" +
            data._id +
            "' onclick=\"dele('" +
            data.name +
            "','" +
            data._id +
            "')\">Delete</a></td>";
        });
      } else {
        blockCode = "<h1>Data not found</h1>";
      }
      document.querySelector("#data-query").innerHTML = blockCode;
    }
  };
  xhttp.open("GET", path + "/getByDate?date=" + date + "&path=" + path, true);
  xhttp.send();
}

function deleteData(name, id, path) {
  var result = confirm("Do you want to delete '" + name + "' field");
  if (result == true) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const datas = JSON.parse(this.responseText);
        if (datas.check) {
          alert("Remove " + name + " field successfull");
          window.location.href = path;
        } else {
          alert("Remove false");
        }
      }
    };
    xhttp.open("GET", path + "/delete/" + id, true);
    xhttp.send();
  }
}

function dele(name, id) {
  let path = "";
  if (window.location.pathname === "/import") {
    path = "/import";
  }
  if (window.location.pathname === "/export") {
    path = "/export";
  }

  deleteData(name, id, path);
}
