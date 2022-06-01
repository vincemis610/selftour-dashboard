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
        html = html + `<tr style="${(tour.status_tour === 1) ?'background-color:#eafaf1': 'background-color:#fbfcfc'}">
                <td>${ (tour.title.length > 25) ? tour.title.substring(0, 25)+'...' : tour.title }</div></td>
                <td>${ (tour.status_tour === 1) ? `<label class="switch">
                                                        <input type="checkbox" checked disabled>
                                                        <span class="slider round"></span>
                                                    </label>` 
                                                : `<label class="switch">
                                                        <input type="checkbox" disabled>
                                                        <span class="slider round"></span>
                                                    </label>`}
                </td>
                <td>${tour.tourmaker}</td>
                <td>${(tour.cant_sitios === 0 ) ? '<icon class="fa fa-ban disable"></icon>' : tour.cant_sitios }</td>
                <td>${(tour.images === 0) ? '<icon class="fa fa-exclamation-triangle disable"></icon>' : tour.images}</td>
                <td>$ ${tour.price} ${tour.moneda}</td>
                <td>${tour.ventas}</td>
                <td>${ tour.warnings.map( w => `<li style="${(w === 'Terminado') ? 'color:green' : 'color:red' }">${w}</li>`).join(' ') }</td>
            </tr>`
    });

    document.querySelector('#reporte-tour').innerHTML = html;
}

const poblarUI = async () => {
    await storeData();
    let reportsTour = JSON.parse(localStorage.getItem('reportsTour'));
    poblarTablaTours(reportsTour.report);

    const check = document.querySelector('.switch input');

    check.addEventListener('change', (event) => {
        console.log(event.target);
    }, false);

}

poblarUI();




