document.getElementById("reportForm").onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    lat: 3.1390,
    lng: 101.6869
  };

  await fetch("http://127.0.0.1:8000/report", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  alert("Report sent!");
  
};
