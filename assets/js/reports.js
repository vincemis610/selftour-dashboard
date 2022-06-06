//const URL = 'http://localhost:3000';
const URL = 'https://selftour.travel/rest-api';

// Almacenar datos
const storeData = async () => {
    const url = `${URL}/tour-reports`;
    const res = await fetch(url);
    reports = await res.json();
    localStorage.setItem('reportsTour', JSON.stringify(reports));
}

// funcion que pobla la tabla de tours
const poblarTablaTours = (data) => {
    let html = '';
    data.map( tour => { 
        html = html + `<tr style="${(tour.status_tour === 1) ?'background-color:#eafaf1': 'background-color:#fbfcfc'}" id="tour-${tour.idtour}">
                <td>${ (tour.title.length > 25) ? tour.title.substring(0, 25)+'...' : tour.title }</div></td>
                <td>${ (tour.status_tour === 1) ? `<label class="switch">
                                                        <input type="checkbox" checked disabled data-warnings="${tour.warnings.join('|')}">
                                                        <span class="slider round"></span>
                                                    </label>` 
                                                : `<label class="switch">
                                                        <input type="checkbox" disabled data-warnings="${tour.warnings.join('|')}">
                                                        <span class="slider round"></span>
                                                    </label>`}
                </td>
                <td>${tour.tourmaker}</td>
                <td>${(tour.cant_sitios === 0 ) ? '<icon class="fa fa-ban disable"></icon>' : tour.cant_sitios }</td>
                <td>${(tour.images === 0) ? '<icon class="fa fa-exclamation-triangle disable"></icon>' : tour.images}</td>
                <td>$ ${tour.price} ${tour.moneda}</td>
                <td>${tour.ventas}</td>
                <td>${ tour.warnings.map( w => `<li style="${(w === 'Ok') ? 'color:#45b39d' : 'color:#e74c3c' }">${w}</li>`).join(' ') }</td>
            </tr>`
    });

    document.querySelector('#reporte-tour').innerHTML = html;
}

// Funcion que ejecuta la poblacion de la pagina y agrega evento
const poblarUI = async () => {
    await storeData();
    let reportsTour = JSON.parse(localStorage.getItem('reportsTour'));
    poblarTablaTours(reportsTour.report);

    const check = document.querySelectorAll('.switch .slider');
    check.forEach( val => val.addEventListener('click', event => enableDisable(event) ));
}

// Poblar pagina
poblarUI();

// Habilitar o Deshabilitar Tour
const enableDisable = (e) => {
    let element = e.target.previousElementSibling;
    (element.checked) ? disableTour(element) : enableTour(element);
}

// Deshabilitar Tour
disableTour = (element) => {
    let parent = element.parentNode.parentNode.parentNode;
    console.log('ID: ', parent.id)
    Swal.fire({
        title: 'Deshabilitar Tour?',
        text: "El tour no sera visible en la plataforma!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deshabilitar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deshabilitado!',
                'El tour ha sido deshabilitado.',
                'success'
            )
            element.removeAttribute('checked');
            parent.style.backgroundColor = '#fbfcfc';
            parent.lastElementChild.innerHTML = '<li style="color:#e74c3c">Activar</li>';
        }
    });
}

// Habilitar Tour
enableTour = (element) => {
    let parent = element.parentNode.parentNode.parentNode;
    console.log(parent.id)
    if(element.dataset.warnings === 'Activar'){
        Swal.fire({
            title: 'Habilitar Tour?',
            text: "El tour sera visible en la plataforma!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Habilitar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Habilitado!',
                    'El tour ha sido habilitado.',
                    'success'
                )
                element.setAttribute('checked', true);
                parent.lastElementChild.innerHTML = '<li style="color:#45b39d">Ok</li>';
                parent.style.backgroundColor = '#eafaf1';
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Pendientes..!',
            html: `${element.dataset.warnings.split("|").join('<br>')}`
        }); 
    }
}

