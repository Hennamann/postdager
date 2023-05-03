import ical from 'ical-generator';
import http from 'http';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import request from 'request';

const currentYear = new Date().getFullYear()

const options = {
    url: 'https://www.posten.no/kundeservice/sendinger-i-norge/sporsmal-om-levering-av-post/_/service/no.posten.website/delivery-days?postalCode=4007',
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

    for (var i = 0; i < deliveryDays['delivery_dates'].length; i++) {
        var obj = deliveryDays['delivery_dates'][i];

        cal.createEvent({
            timezone: "Europe/Oslo",
            start: obj + " " + currentYear,
            allDay: true,
            summary: 'Postdag',
            description: obj,
            location: '4007'
        });
    }

    cal.saveSync('./docs/postdager.ics');
});
