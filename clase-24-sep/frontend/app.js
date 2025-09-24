const API_URL = "http://localhost:3000/loans";

async function loadLoans() {
  try {
    const res = await axios.get(API_URL);
    const loans = res.data;

    const list = document.getElementById("loan-list");
    list.innerHTML = "";

    loans.forEach((loan) => {
      const li = document.createElement("li");
      li.textContent = `${loan.bookTitle} - vence el ${loan.dueDate}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error al cargar préstamos", err);
  }
}

loadLoans();
setInterval(loadLoans, 10000); // refresca cada 10s
