//const URL = 'http://localhost:3000';
const URL = 'https://selftour.travel/rest-api';

const storeData = async () => {
    const url = `${URL}/tour-reports`;
    const res = await fetch(url);
    reports = await res.json();
    localStorage.setItem('reportsTour', JSON.stringify(reports));
}

// function que pobla la tabla de tours
const poblarTablaTours = (data) => {
    console.log(data);
    let html = '';
    data.map( tour => { 
        html = html + `<tr>
                <td>
                    <div class="media">
                        <img src="${tour.screenshotTour }" width="65" height="50" style="border-radius:50%;padding: 0 10px;" alt="Fail">
                        <div class="media-body align-self-center">
                            <div>${ (tour.title.length > 25) ? tour.title.substring(0, 25)+'...' : tour.title }</div>
                        </div>
                    </div>
                </td>
                <td>${ (tour.status_tour === 1) ? 'SI' : '<strong style="color: red;">NO</strong>' }</td>
                <td>${tour.tourmaker}</td>
                <td>${tour.mail}</td>
                <td>${(tour.cant_sitios === 0 ) ? '<strong style="color:red;">Ninguno</strong>' : tour.cant_sitios }</td>
                <td>${(tour.images === 0) ? '<strong style="color:red;">Ninguno</strong>' : tour.images}</td>
                <td>$ ${tour.price} ${tour.moneda}</td>
                <td>${tour.ventas}</td>
                <td>${(tour.ventas * tour.price).toFixed(2)}</td>
            </tr>`
    });

    document.querySelector('#reporte-tour').innerHTML = html;
}

const poblarUI = async () => {
    await storeData();
    let reportsTour = JSON.parse(localStorage.getItem('reportsTour'));
    poblarTablaTours(reportsTour.report);
}

poblarUI();