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
        let status = (tour.status_tour === 0 || tour.cant_sitios === 0 || tour.images === 0) ? '<strong class="text-danger">Pendiente</strong>' : '<strong class="text-success">Aprovado</strong>';
        console.log(status)
        html = html + `<tr>
                <td>${ (tour.title.length > 25) ? tour.title.substring(0, 25)+'...' : tour.title }</div></td>
                <td>${ (tour.status_tour === 1) ? '<icon class="fa fa-check-circle enable"></icon>' : '<icon class="fa fa-ban disable"></icon>' }</td>
                <td>${tour.tourmaker}</td>
                <td>${(tour.cant_sitios === 0 ) ? '<icon class="fa fa-ban disable"></icon>' : tour.cant_sitios }</td>
                <td>${(tour.images === 0) ? '<icon class="fa fa-exclamation-triangle disable"></icon>' : tour.images}</td>
                <td>$ ${tour.price} ${tour.moneda}</td>
                <td>${tour.ventas}</td>
                <td>${ status }</td>
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