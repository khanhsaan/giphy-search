const delayTime = 1000;

const minDelay = new Promise((resolve, _) => {
    setTimeout(() => {
        resolve(true)
    }, delayTime);
})

export default minDelay;