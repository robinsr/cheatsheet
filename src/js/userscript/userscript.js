const $save_btn = $("#save-btn");
const $img_preview = $("#img-out-preview");
const $kbd_container = $("#output-location");


const get_keyboard_event = (str_cmd) => {
    var key_event = {};

    return str_cmd.split('-').forEach(key => {
        if (keys_dict[key]) {
            Object.assign(key_event, keys_dict[key].event_config)
            return;
        }

        Object.assign(key_event, {
            key: key
        })
    })

    return key_event;
}


const map_with_key_events = (conf_item) => {
    return Object.assign(conf_item, { 
       event_config: get_keyboard_event(conf_item.cmd)
   });
}

const send_command = (event_config) => new Promise(resolve => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', event_config));
    setTimeout(resolve, 50);
});

const map_kbd_elems = () => new Promise(resolve => {
    let kbds = $kbd_container.children("kbd");

    kbds.each((i, elem) => {
        let $elem = $(elem);

        $elem.css({ "font-size": "16px" });

        if (Object.keys(keys_dict).includes($elem.text())) {
            $elem.text(keys_dict[$elem.text()].symbol)
        }
    });

    setTimeout(resolve, 50);
});

const click_gen = () => new Promise(resolve => {
    $save_btn.click()
    setTimeout(resolve, 100);
});

const get_image_url = () => {
    return document.getElementById('img-out-preview').children[0].src
}

const execute_cmd = (conf_item) => {
    map_with_key_events(conf_item);

    return new Promise((resolve, reject) => {
        send_command(conf_item.event_config)
        .then(() => map_kbd_elems())
        .then(() => click_gen())
        .then(() => {
            Object.assign(conf_item, { url: get_image_url() });
            resolve(conf_item);
        })
        .catch(reject);
    })
}

const init = async () => {
    for (let conf_item of config) {
        let processed_item = await execute_cmd(conf_item);
    }

    console.log("DONE");
}

function print() {
    console.log(config);
}
