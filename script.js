const slots = document.querySelectorAll('.slot');
const slotsArray = [];
for (let i = 0; i < slots.length; i++)
    slotsArray.push(slots[i]);
const tops = document.querySelectorAll('.topStack');
const topsArray = [];
for (let i = 3; i < tops.length; i++)
    topsArray.push(tops[i]);
//A,2,3,4,5,6,7,8,9,10, J, Q, K
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
const SUITS = ["minnie", "mickey", "daisy", "donald"];
const layer = document.querySelector('#animationLayer');

//reset elements
const restartButtonEl = document.querySelector("#restartButton");
const restartScreenEl = document.querySelector("#restartModal");
const restartConfirmEl = document.querySelector("#confirmRestart");
const restartDenyEl = document.querySelector("#denyRestart");
restartConfirmEl.addEventListener('click', () => {
    restartButtonEl.style.display = "none";
    restartScreenEl.style.display = "none";
    clearBoard();
});
restartDenyEl.addEventListener('click', () => {
    restartScreenEl.style.display = "none";
});
restartButtonEl.addEventListener('click', () => {
    restartScreenEl.style.display = "flex";
});
//variables for card movement
let offsetX = 0;
let offsetY = 0;
let initialX = 0;
let initialY = 0;
let initialTrans = "";
setGame();
function setGame() {
    let deckOfCards = [];
    //populates the deck with all the cards
    for (let i = 0; i < NUMBERS.length; i++) {
        for (let k = 0; k < SUITS.length; k++) {
            let card = document.createElement('div');
            card.classList.add('card');
            card.id = "c" + NUMBERS[i] + SUITS[k];
            card.classList.add(NUMBERS[i]);
            card.classList.add(SUITS[k]);
            card.classList.add('cardBack');
            deckOfCards.push(card);
        }
    }

    //populates the slots with the cards
    for (let i = 0; i < slots.length; i++) {
        for (let k = i; k < slots.length; k++) {
            let randomnum = Math.floor(Math.random() * deckOfCards.length);
            let card = deckOfCards[randomnum];
            slots[k].appendChild(card);
            deckOfCards.splice(randomnum, 1);
            let offset = 20 * i;
            card.style.transform = `translateY(${offset}px)`;
        }
    }
    //adds the rest to the draw pile
    let mostRecentCard = tops[0];
    //24 is for the cards left after the 28 get sorted on the board
    for (let i = 0; i < 24; i++) {
        let randomnum = Math.floor(Math.random() * deckOfCards.length);
        let card = deckOfCards[randomnum];
        mostRecentCard.appendChild(card);
        deckOfCards.splice(randomnum, 1);
    }
    //adds event listener to the top card of the draw pile
    // tops[0].children[tops[0].children.length - 1].addEventListener('click', flipFromCardPile);
    tops[0].children[tops[0].children.length - 1].addEventListener('touchend', flipFromCardPile);

    //flips the cards at the end of the columns
    flipCards();
}

slots.forEach(slot => {
    slot.addEventListener('dragover', dragOverFunction);
    slot.addEventListener('drop', placeCard);
});
tops[3].addEventListener('dragover', dragOverFunction);
tops[4].addEventListener('dragover', dragOverFunction);
tops[5].addEventListener('dragover', dragOverFunction);
tops[6].addEventListener('dragover', dragOverFunction);
tops[3].addEventListener('drop', placeCard);
tops[4].addEventListener('drop', placeCard);
tops[5].addEventListener('drop', placeCard);
tops[6].addEventListener('drop', placeCard);

//flips the cards that you can flip and stuff
let resetCard = document.createElement('div');
resetCard.classList.add('card');
resetCard.id = "resetCard";
// resetCard.addEventListener('click', resetFlipPile);
resetCard.addEventListener('touchend', resetFlipPile);

function flipFromCardPile(e) {
    // e.target.removeEventListener('click', flipFromCardPile);
    e.target.removeEventListener('touchend', flipFromCardPile);

    let topCard = tops[0].children[tops[0].children.length - 1];
    for (let i = 0; i < 3; i++) {
        if (topCard != undefined) {
            tops[1].appendChild(topCard);
            topCard.classList.remove('cardBack');
            if (topCard.classList.contains('mickey') || topCard.classList.contains('minnie')) {
                topCard.classList.add('black');
            }
            else {
                topCard.classList.add('red');
            }
            let newId = topCard.id.substring(1);
            topCard.style.backgroundImage = `url(Cards/${newId}.png)`;
            // topCard.innerHTML = `${topCard.classList[1]} ${topCard.classList[2]}`;
            topCard.style.color = 'white';
            topCard.setAttribute('draggable', true);
            topCard.addEventListener('dragstart', lastElement);
            topCard.addEventListener('dragover', dragOverFunction);
            topCard.addEventListener('drop', placeCard);
            topCard.addEventListener('touchstart', startTouch);
            topCard.addEventListener('touchmove', startMove);
            topCard.addEventListener('touchend', startEnd);
        }
        topCard = tops[0].children[tops[0].children.length - 1];
    }
    if (topCard != undefined) {
        // topCard.addEventListener('click', flipFromCardPile);
        topCard.addEventListener('touchend', flipFromCardPile);
    }
    else {
        tops[0].appendChild(resetCard);
    }
}
//resets the flip pile
function resetFlipPile(e) {
    // console.log("reseting");
    resetCard.remove();
    let topCard = tops[1].children[tops[1].children.length - 1];
    while (tops[1].children.length != 0) {
        topCard = tops[1].children[tops[1].children.length - 1];
        topCard.classList.add('cardBack');
        if (topCard.classList.contains('mickey') || topCard.classList.contains('minnie')) {
            topCard.classList.remove('black');
        }
        else {
            topCard.classList.remove('red');
        }
        topCard.style.backgroundImage = ``;

        // topCard.innerHTML = ``;
        topCard.removeAttribute('draggable', true);
        topCard.removeEventListener('dragstart', lastElement);
        topCard.removeEventListener('dragover', dragOverFunction);
        topCard.removeEventListener('drop', placeCard);
        topCard.removeEventListener('touchstart', startTouch);
        topCard.removeEventListener('touchmove', startMove);
        topCard.removeEventListener('touchend', startEnd);
        tops[0].appendChild(topCard);
    }
    if (tops[0].children[0] != undefined) {
        // tops[0].children[tops[0].children.length - 1].addEventListener('click', flipFromCardPile);
        tops[0].children[tops[0].children.length - 1].addEventListener('touchend', flipFromCardPile);

    }
}

//turns over the cards at the end of the columns
function flipCards() {
    if (tops[1].children.length == 1) {
        resetCard.remove();
    }
    for (let i = 0; i < slots.length; i++) {
        let endCard = slots[i].children[[slots[i].children.length - 1]];
        if (endCard != null && endCard.classList.contains('cardBack')) {
            endCard.classList.remove('cardBack');
            if (endCard.classList.contains('mickey') || endCard.classList.contains('minnie')) {
                endCard.classList.add('black');
            }
            else {
                endCard.classList.add('red');
            }
            let newId = endCard.id.substring(1);
            // console.log(newId);
            endCard.style.backgroundImage = `url(Cards/${newId}.png)`;
            // endCard.innerHTML = `${endCard.classList[1]} ${endCard.classList[2]}`;
            endCard.style.color = 'white';
            endCard.setAttribute('draggable', true);
            endCard.addEventListener('dragstart', lastElement);
            endCard.addEventListener('dragover', dragOverFunction);
            endCard.addEventListener('drop', placeCard);
            // Handle touchstart
            endCard.addEventListener('touchstart', startTouch);
            // Handle touchmove
            endCard.addEventListener('touchmove', startMove);
            // Handle touchend to check drop
            endCard.addEventListener('touchend', startEnd);

        }
    }
}

function lastElement(e) {
    e.dataTransfer.setData('text', e.target.id);
    // console.log(e.target);
}

function dragOverFunction(e) {
    e.preventDefault();
}

function placeCard(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData('text');
    let draggedElement = document.getElementById(data);
    if (draggedElement != null && draggedElement != e.target) {
        //place card at the top piles
        let element = e.target;
        while (element.parentElement != null) {
            // console.log(element);
            if (topsArray.includes(element)) {
                if (e.target.children.length == 0) {
                    if ((parseInt(e.target.classList[1]) == (parseInt(draggedElement.classList[1]) - 1)) || parseInt(draggedElement.classList[1]) == 1) {
                        if ((e.target.classList[2] == draggedElement.classList[2]) || parseInt(draggedElement.classList[1]) == 1) {
                            // console.log("can place at top");
                            if (!draggedElement.classList.contains('1')) {
                                e.target.innerHTML = '';
                            }
                            placedCardAtTop(draggedElement);
                            e.target.appendChild(draggedElement);

                        }
                    }
                }
            }
            element = element.parentElement;
        }

        //place cards on eachother
        if ((parseInt((e.target.classList[1]) - 1) == draggedElement.classList[1]) && (e.target.children.length == 0)) {
            if (e.target.classList.contains('black') && draggedElement.classList.contains('red')) {
                draggedElement.style.transform = `translateY(20px)`;
                e.target.appendChild(draggedElement);
            }
            else if (e.target.classList.contains('red') && draggedElement.classList.contains('black')) {
                draggedElement.style.transform = `translateY(20px)`;
                e.target.appendChild(draggedElement);
            }
        }
        //place kings on column
        // console.log(slotsArray.includes(e.target));
        // console.log(draggedElement.classList[1] == 13);
        if (draggedElement.classList[1] == 13 && slotsArray.includes(e.target)) {
            draggedElement.style.transform = `translateY(0px)`;
            e.target.appendChild(draggedElement);
        }

        flipCards();
    }
}

function getColumnDepth(target) {
    let element = target;
    let lastCard = target;
    if (element.children.length > 0) {
        lastCard = element.children[element.children.length - 1];
    }
    if (lastCard.children.length != 0) {
        while (lastCard.children.length != 0) {
            lastCard = lastCard.children[0];
        }
    }
    return lastCard;

}

function getTopDepth(target) {
    let element = target;
    while (element.children[0] != null) {
        element = element.children[0];
    }
    return element;
}

function placedCardAtTop(card) {
    card.style.transform = `translateY(0px)`;
    card.setAttribute('draggable', false);
    card.removeEventListener('dragstart', lastElement);
    card.removeEventListener('touchstart', startTouch);
    card.removeEventListener('touchmove', startMove);
    card.removeEventListener('touchend', startEnd);
}

function getOverlapArea(rect1, rect2) {
    const x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
    const y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
    return x_overlap * y_overlap;
}

//**MOBILE**
function startTouch(e) {
    e.stopPropagation();
    console.log("touched");
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    initialX = e.target.style.left;
    initialY = e.target.style.top;
    initialTrans = e.target.style.transform;
}

function startMove(e) {
    e.stopPropagation();
    console.log("moved");
    e.preventDefault(); // Prevent page scroll
    const touch = e.touches[0];
    let x = touch.clientX - offsetX;
    let y = touch.clientY - offsetY;
    //ADD LOOP TO LOOP THROUGHT ALL THE PARENTS AND CHANGE THEIRE Z
    if ((!slotsArray.includes(e.target.parentElement) && (e.target.parentElement != tops[1]))) {
        let parent = e.target.parentElement;
        let columnParent = e.target.parentElement;
        let containerrect = parent.getBoundingClientRect();
        //------parent.style.zIndex = 50;
        x -= containerrect.left;
        y -= containerrect.top;

        while (!slotsArray.includes(columnParent)) {
            columnParent = columnParent.parentElement;
            console.log(columnParent);
        }
        columnParent = columnParent.children[columnParent.children.length - 1];
        columnParent.style.zIndex = 50;
    }
    //RETURN THE Z INDEX BACK TO 0 FOR THE LAST CHILD OF THE SLOT
    // if ((!slotsArray.includes(e.target.parentElement) && (e.target.parentElement != tops[1]))) {
    //     let parent = e.target.parentElement;
    //     console.log(parent);
    //     while (!slotsArray.includes(parent)) {
    //         parent = parent.parentElement;
    //         console.log(parent);
    //     }
    //     parent = parent.children[parent.children.length - 1];
    //     let containerrect = parent.getBoundingClientRect();
    //     parent.style.zIndex = 50;
    //     x -= containerrect.left;
    //     y -= containerrect.top;
    // }
    e.target.style.left = `${x}px`;
    e.target.style.top = `${y}px`;
    e.target.style.transform = 'translateY(0px)';
    e.target.style.zIndex = 100;
}

function startEnd(e) {
    e.stopPropagation();
    console.log(e.target);
    const dragRect = e.target.getBoundingClientRect();
    let dropRect;
    let isDropped = false;
    let droppingOnElement;
    let bestZone = null;
    let maxOverlap = 0;

    if (e.target != null) {
        //place card at the top piles
        for (let i = 3; i < 7; i++) {
            dropRect = getTopDepth(tops[i]).getBoundingClientRect();
            let overlap = getOverlapArea(dragRect, dropRect);
            droppingOnElement = getTopDepth(tops[i]);
            if ((parseInt(droppingOnElement.classList[1]) == (parseInt(e.target.classList[1]) - 1)) || parseInt(e.target.classList[1]) == 1) {
                if ((droppingOnElement.classList[2] == e.target.classList[2]) || parseInt(e.target.classList[1]) == 1) {
                    if (overlap > maxOverlap) {
                        maxOverlap = overlap;
                        bestZone = droppingOnElement;
                        isDropped =
                            dragRect.right > dropRect.left &&
                            dragRect.left < dropRect.right &&
                            dragRect.bottom > dropRect.top &&
                            dragRect.top < dropRect.bottom;
                        console.log(bestZone);
                    }
                }
            }
        }
        if (isDropped) {
            // console.log("can place at top on mobil");
            if (!e.target.classList.contains('1')) {
                bestZone.innerHTML = '';
            }
            console.log("translating to 0 because card was placed at top");
            placedCardAtTop(e.target);
        }
        //place cards on eachother
        if (!isDropped) {
            for (let i = 0; i < 7; i++) {
                dropRect = getColumnDepth(slots[i]).getBoundingClientRect();
                let overlap = getOverlapArea(dragRect, dropRect);
                droppingOnElement = getColumnDepth(slots[i]);
                if ((parseInt((droppingOnElement.classList[1]) - 1) == e.target.classList[1]) && (droppingOnElement.children.length == 0)) {
                    if ((e.target.classList.contains('black') && droppingOnElement.classList.contains('red')) || (e.target.classList.contains('red') && droppingOnElement.classList.contains('black'))) {
                        if (overlap > maxOverlap) {
                            maxOverlap = overlap;
                            bestZone = droppingOnElement;
                            isDropped =
                                dragRect.right > dropRect.left &&
                                dragRect.left < dropRect.right &&
                                dragRect.bottom > dropRect.top &&
                                dragRect.top < dropRect.bottom;
                        }
                    }
                }
            }
            if (isDropped) {
                console.log("translating to 20 because card was placed at card");

                e.target.style.transform = `translateY(20px)`;
            }
        }
        //place kings on column
        if (!isDropped) {
            for (let i = 0; i < 7; i++) {
                if (!isDropped) {
                    dropRect = slots[i].getBoundingClientRect();
                    let overlap = getOverlapArea(dragRect, dropRect);
                    droppingOnElement = slots[i];
                    if (e.target.classList[1] == 13 && slotsArray.includes(droppingOnElement)) {
                        if (droppingOnElement.children.length == 0) {
                            if (overlap > maxOverlap) {
                                maxOverlap = overlap;
                                bestZone = droppingOnElement;
                                isDropped =
                                    dragRect.right > dropRect.left &&
                                    dragRect.left < dropRect.right &&
                                    dragRect.bottom > dropRect.top &&
                                    dragRect.top < dropRect.bottom;
                            }
                            if (isDropped) {
                                console.log("translating to 0 because card was placed at column");

                                e.target.style.transform = `translateY(0px)`;
                            }
                        }
                    }
                }
            }
        }

    }
    if (bestZone != null)
        console.log(bestZone);

    if (isDropped) {
        bestZone.appendChild(e.target);
        // e.target.style.position = 'static'; // optional, for layout reset
        e.target.style.left = '';
        e.target.style.top = '';

        e.target.style.zIndex = 0;
        //win?
        let win = 0;
        for (let i = 0; i < topsArray.length; i++) {
            if (getTopDepth(topsArray[i]).classList.contains(13)) {
                win++;
            }
        }
        if (win == 4) {
            //WIN
            const winMessageEl = document.querySelector("#winMessage");
            if (localStorage.getItem("wins") == undefined) {
                localStorage.setItem("wins", 0);
            }
            let winsAmount = localStorage.getItem("wins");
            winsAmount++;
            localStorage.setItem("wins", winsAmount);
            if (winsAmount == 1)
                winMessageEl.innerHTML = `You have won ${winsAmount} time!`;
            else
                winMessageEl.innerHTML = `You have won ${winsAmount} times!`;
            document.querySelector("#winContainer").style.display = "flex";
        }
        flipCards();
    }
    else {
        //console.log("cards going back?");
        e.target.style.left = initialX;
        e.target.style.top = initialY;
        e.target.style.transform = initialTrans;
        e.target.style.zIndex = 0;
    }

}
function clearBoard() {
    //ANIMATION TESTJING
    const cards = document.querySelectorAll('.card');
    const centerClones = [];
    let count = 0;
    cards.forEach(card => {
        //Doesn't clone the already cloned children
        if (card.getBoundingClientRect().left !== 0) {
            //makes all the clones
            const rect = card.getBoundingClientRect();
            const clone = card.cloneNode(true);
            clone.classList.remove("red");
            clone.classList.remove("black");
            clone.id = "";
            clone.style.backgroundImage = `url(Cards/back.png)`;
            clone.classList.add("cardBack");
            clone.style.position = 'absolute';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.transform = '';
            //adds tiny stagger so flyToCenter animations don't all run exactly at once
            clone.style.animationDelay = count + "s";
            count += 0.005;

            layer.appendChild(clone);
            //***  NEED TO CLONE THE CHILDREN OF THE CHILDREN  ***/
            let childClone = getColumnDepth(clone);
            let parentClone = childClone.parentElement;
            let childrenCount = 0;
            //clone cards children
            while (childClone != clone) {
                if (parentClone != childClone.parentElement) {
                    childClone = parentClone;
                }
                parentClone = childClone.parentElement;
                const childRect = childClone.getBoundingClientRect();
                childClone.classList.remove("red");
                childClone.classList.remove("black");
                childClone.id = "";
                childClone.style.backgroundImage = `url(Cards/back.png)`;
                childClone.classList.add("cardBack");
                childClone.style.position = 'absolute';
                childClone.style.left = childRect.left + 'px';
                childClone.style.top = childRect.top + 'px';
                childClone.style.transform = '';
                childClone.style.animationDelay = clone.style.animationDelay;
                count += 0.005;
                layer.appendChild(childClone);
                centerClones.push(childClone);
                childrenCount++;
            }
            //delete all the original children
            // for (let i = 0; i < childrenCount; i++) {
            //     const child = card.children[i];
            //     child.remove();
            //     i--;
            // }


            //removes original
            card.remove();

            // mark clone for centering (we'll handle animation via JS to avoid CSS percent/transform mixing)
            // clone.classList.add('flyToCenter');

            centerClones.push(clone);
        }
    });

    // Use CSS-driven fly-to-center: compute dx/dy and set CSS vars, then add `flyToCenter` class
    const STAGGER_MS = 6;
    const FLY_DURATION = 1500;

    centerClones.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        // ensure clone has layer-relative start coords
        let startLeft = parseFloat(card.style.left);
        let startTop = parseFloat(card.style.top);
        if (isNaN(startLeft) || isNaN(startTop)) {
            startLeft = rect.left;
            startTop = rect.top;
            card.style.left = startLeft + 'px';
            card.style.top = startTop + 'px';
        }

        // target: center of the viewport (screen). Compute viewport center and convert to layer-relative coords
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const finalLeft = viewportCenterX - (rect.width / 2);
        const finalTop = viewportCenterY - (rect.height / 2);
        const dx = finalLeft - startLeft;
        const dy = finalTop - startTop;

        // set CSS variables used by the CSS keyframes
        card.style.setProperty('--dx', dx + 'px');
        card.style.setProperty('--dy', dy + 'px');
        card.style.setProperty('--fly-delay', `${idx * STAGGER_MS}ms`);
        // trigger the CSS animation
        card.classList.add('flyToCenter');
    });

    // Wait for CSS animations to finish using animationend
    const flyPromises = centerClones.map((card, idx) => new Promise(resolve => {
        let finished = false;
        function onEnd(e) {
            // we only care about our fly animation finishing
            card.removeEventListener('animationend', onEnd);
            finished = true;

            // compute final commit: startLeft + dx
            const rect = card.getBoundingClientRect();
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;
            const finalLeft = viewportCenterX - (rect.width / 2);
            const finalTop = viewportCenterY - (rect.height / 2);

            card.style.left = finalLeft + 'px';
            card.style.top = finalTop + 'px';
            card.style.transform = '';
            card.style.willChange = 'auto';
            card.dataset.shufflesDone = '0';
            card.style.animationDelay = '';
            card.classList.remove('flyToCenter');
            card.classList.add('centered');
            resolve(card);
        }
        card.addEventListener('animationend', onEnd, { once: true });

        // fallback
        setTimeout(() => {
            if (finished) return;
            onEnd();
        }, FLY_DURATION + idx * STAGGER_MS + 400);
    }));

    Promise.all(flyPromises).then(cards => {
        // configure random repeat range
        const SHUFFLE_MIN = 6;
        const SHUFFLE_MAX = 7;
        let repeats = Math.floor(Math.random() * (SHUFFLE_MAX - SHUFFLE_MIN + 1)) + SHUFFLE_MIN;
        // repeats = 1; // for testing, set to 1 to skip shuffling
        //console.log(`Each card will shuffle ${repeats} times.`);

        // start shuffling after all cards are centered
        shuffle(repeats);
    });

}

function shuffle(repeats) {
    // Use an animation-end driven loop so we don't treat a shuffle pass as "done" until
    // the CSS `shuffle` animation actually finishes on every card.
    const centerCards = Array.from(layer.querySelectorAll('.centered'));

    // Pin current computed pixel positions and clear any transforms so shuffle starts from the visual center
    centerCards.forEach(card => {
        if (isNaN(parseInt(card.dataset.shufflesDone, 10))) {
            card.dataset.shufflesDone = '0';
        }
    });

    const SHUFFLE_DURATION_FALLBACK = 2000; // ms; slightly longer than CSS duration (1.5s)
    const SHUFFLE_STAGGER_MS = 8; // small delay between starting each card's shuffle

    async function runPass() {
        const toShuffle = centerCards.filter(card => parseInt(card.dataset.shufflesDone, 10) < repeats);
        if (toShuffle.length === 0) {
            // all done
            centerCards.forEach(c => {
                c.classList.remove('shuffle');
                delete c.dataset.shufflesDone;
                c.classList.add('centered');
            });
            playDealAnimation();
            return;
        }

        // Trigger shuffle animation on each card with a small stagger and wait for each animationend
        const promises = toShuffle.map((card, idx) => new Promise(resolve => {
            let resolved = false;
            function onEnd(e) {
                if (!e.animationName || e.animationName === 'shuffle') {
                    if (resolved) return;
                    resolved = true;
                    card.removeEventListener('animationend', onEnd);
                    resolve(card);
                }
            }
            card.addEventListener('animationend', onEnd);

            // Start the animation with a stagger so cards don't all animate at once
            setTimeout(() => {
                card.classList.remove('shuffle');
                void card.offsetWidth;
                card.classList.add('shuffle');
            }, idx * SHUFFLE_STAGGER_MS);

            // Fallback: resolve after duration + stagger in case animationend doesn't fire
            setTimeout(() => {
                if (resolved) return;
                resolved = true;
                card.removeEventListener('animationend', onEnd);
                resolve(card);
            }, SHUFFLE_DURATION_FALLBACK + idx * SHUFFLE_STAGGER_MS + 200);
        }));

        // Wait for this pass (all staggered animations) to finish on all cards
        await Promise.all(promises);

        // Increment counts for cards we just shuffled
        toShuffle.forEach(card => {
            const done = parseInt(card.dataset.shufflesDone, 10) || 0;
            card.dataset.shufflesDone = done + 1;
        });

        // Small micro-delay between passes to avoid immediate reflow storms
        setTimeout(runPass, 50);
    }

    runPass();
}

function playDealAnimation() {
    const centerCards = Array.from(layer.querySelectorAll('.centered'));

    const layerRect = layer.getBoundingClientRect();
    // Stabilize positions and remove animation classes before JS animations start
    centerCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // pin to computed pixel position relative to layer to avoid CSS vs JS animation conflicts
        card.style.left = (rect.left) + 'px';
        card.style.top = (rect.top) + 'px';
        // clear inline transform (computed position already accounts for any transform)
        card.style.transform = '';
        card.classList.remove('flyToCenter');
        card.classList.remove('shuffle');
    });
    // Build the standard solitaire dealing sequence: rows left->right so columns end up with 1..7
    const placementList = []; // {slotIndex, offset}
    const columnCounts = [0, 0, 0, 0, 0, 0, 0];
    for (let row = 0; row < 7; row++) {
        for (let col = row; col < 7; col++) {
            placementList.push({ slotIndex: col, offset: columnCounts[col] * 20 });
            columnCounts[col] += 1;
        }
    }

    const animations = [];
    const DURATION = 400;
    const STAGGER = 500; //110

    // Animate cards to columns according to placementList
    placementList.forEach((place, i) => {
        const card = centerCards.shift();
        if (!card) return;
        const targetSlot = slots[place.slotIndex];
        const targetRect = targetSlot.getBoundingClientRect();
        const cardBox = card.getBoundingClientRect();
        // center the card inside the target slot (layer-relative)
        const finalLeft = targetRect.left;
        const finalTop = (targetRect.top + place.offset);

        // Use the pinned inline px values as the start (avoids paint/race issues)
        // ensure pinned values are flushed to layout
        card.offsetWidth;
        const startLeft = parseFloat(card.style.left) || (cardBox.left - layerRect.left);
        const startTop = parseFloat(card.style.top) || (cardBox.top - layerRect.top);

        // ensure starting absolute position (layer-relative)
        card.style.left = startLeft + 'px';
        card.style.top = startTop + 'px';
        card.style.willChange = 'transform';
        card.style.transform = 'translate3d(0px, 0px, 0px)';

        const dx = finalLeft - startLeft;
        const dy = finalTop - startTop;

        const anim = card.animate([
            { transform: 'translate3d(0px, 0px, 0px)' },
            { transform: `translate3d(${dx}px, ${dy}px, 0px)` }
        ], {
            duration: DURATION,
            easing: 'cubic-bezier(.22,.9,.27,1)',
            delay: i * STAGGER,
            fill: 'forwards'
        });

        const p = new Promise(resolve => {
            anim.onfinish = () => {
                // commit final layout and cleanup transform hint
                // card.style.left = finalLeft + 'px';
                // card.style.top = finalTop + 'px';
                // card.style.transform = '';
                card.style.willChange = 'auto';
                // collect id for deterministic placement
                resolve();
            };
        });
        animations.push(p);
    });

    // After column placements, put remaining cards on the draw pile (tops[0])
    const baseDelay = placementList.length * STAGGER + DURATION;
    centerCards.forEach((card, idx) => {
        const cardBox = card.getBoundingClientRect();
        const drawRect = tops[0].getBoundingClientRect();
        // small jitter offsets to create stacked look
        // ensure pinned values are flushed to layout
        card.offsetWidth;
        const startLeft = parseFloat(card.style.left) || (cardBox.left - layerRect.left);
        const startTop = parseFloat(card.style.top) || (cardBox.top - layerRect.top);
        // center the card on the draw pile
        const finalLeft = drawRect.left;
        const finalTop = drawRect.top;

        card.style.left = startLeft + 'px';
        card.style.top = startTop + 'px';
        card.style.willChange = 'transform';
        card.style.transform = 'translate3d(0px, 0px, 0px)';

        const dx = finalLeft - startLeft;
        const dy = finalTop - startTop;

        const anim = card.animate([
            { transform: 'translate3d(0px, 0px, 0px)' },
            { transform: `translate3d(${dx}px, ${dy}px, 0px)` }
        ], {
            duration: 300,
            easing: 'cubic-bezier(.22,.9,.27,1)',
            delay: baseDelay + idx * 30,
            fill: 'forwards'
        });

        const p = new Promise(resolve => {
            anim.onfinish = () => {
                // card.style.left = finalLeft + 'px';
                // card.style.top = finalTop + 'px';
                // card.style.transform = '';
                card.style.willChange = 'auto';
                resolve();
            };
        });
        animations.push(p);
    });

    // When all animations complete, remove layer and initialize the real game using the exact dealt order
    Promise.all(animations).then(() => {
        // Give a slight pause so the animation settles
        setTimeout(() => {
            layer.innerHTML = '';
            setGame();
            restartButtonEl.style.display = "block";
        }, 150);
    });
};
