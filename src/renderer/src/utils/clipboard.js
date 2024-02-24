
const can_clip = () => {
    return new Promise((resolve, reject) => {
        if (!navigator || !navigator.permissions || !navigator.permissions.query) {
            return reject('No navigator')
        }

        navigator.permissions.query({name: 'clipboard-write'}).then(result => {
            if (result.state == 'granted' || result.state == 'prompt') {
                resolve();
            } else {
                reject(`Cannot write to clipboard (${result.state})`)
            }
        });
    });
}

const copy_to_clip = (clip_val) => {
    return new Promise((resolve, reject) => {
        can_clip().then(() => {
            navigator.clipboard.writeText(clip_val).then(function() {
                resolve("Successfully copied to clipboard");
            }, function(e) {
                reject(new Error('Failed to write to clipboard', e));
            });
        })
        .catch(reject);
    });
}

export default copy_to_clip;
