import ical from 'ical-generator';
import http from 'http';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import request from 'request';

const currentYear = new Date().getFullYear()

const options = {
    url: 'https://www.posten.no/en/delivery-mail/_/component/main/1/leftRegion/1?postCode=4007',
    headers: {
        'x-requested-with': 'XMLHttpRequest'
    }
};

request(options, (err, res, body) => {
    if (err) { return console.log(err); }
    //console.log(body)
    const deliveryDays = JSON.parse(body)
    //console.log(deliveryDays);

    const cal = ical({ name: 'Leveringsdager for postnummer 4007' });

    cal.timezone({
        name: 'timezone',
        generator: getVtimezoneComponent
    });

    for (var i = 0; i < deliveryDays['nextDeliveryDays'].length; i++) {
        var obj = deliveryDays['nextDeliveryDays'][i];

        cal.createEvent({
            timezone: "Europe/Oslo",
            start: obj + " " + currentYear,
            allDay: true,
            summary: 'Postdag',
            description: obj,
            location: '4007'
        });
    }

    http.createServer((req, res) => cal.serve(res))
        .listen(80, '127.0.0.1', () => {
            console.log('Server running at http://127.0.0.1:80');
        });
});
