// Sample text - using more text for better results
        const text = `
            The sun dipped below the horizon, casting an orange glow across the sky.
            A stray cat wandered through the alley, searching for scraps of food.
            The sound of rain tapping against the window was oddly comforting.
            She flipped through the old book, its pages yellowed with age.
            The wind howled through the trees, making the branches sway wildly.
            A distant thunderclap signaled the arrival of the approaching storm.
            His footsteps echoed through the empty hallway, the silence unnerving.
            She carefully arranged the flowers in the vase, adjusting each petal.
            The coffee machine whirred to life, filling the air with a rich aroma.
            A small boat bobbed gently on the surface of the calm lake.
            He adjusted his tie in the mirror, preparing for the important meeting.
            The library was eerily silent, except for the rustling of pages.
            A single candle flickered in the darkness, casting strange shadows.
            She hesitated at the door, uncertain if she should knock or leave.
            The ancient clock in the hallway chimed loudly at midnight.
            A faint melody drifted through the air, barely audible over the wind.
            The scent of freshly baked bread filled the tiny kitchen.
            A lone crow perched on the fence, watching everything intently.
            The car engine sputtered before finally roaring to life.
            She traced patterns in the sand with the tip of her finger.
            A cool breeze carried the scent of salt from the nearby ocean.
            The marketplace bustled with people shouting and haggling over prices.
            A dog barked in the distance, breaking the stillness of the night.
            The waves crashed against the rocks, sending white foam into the air.
            He opened the old wooden chest, revealing a collection of forgotten trinkets.
            The streetlights flickered as he walked down the deserted road.
            She carefully folded the letter and slipped it into an envelope.
            A soft chuckle escaped his lips as he recalled an old memory.
            The room was filled with the soft hum of conversation and laughter.
            A butterfly landed gently on her outstretched hand.
            The spaceship hovered just above the surface, its lights blinking.
            The crisp autumn leaves crunched beneath his boots with every step.
            A single tear rolled down her cheek, but she quickly wiped it away.
            The train rumbled down the tracks, its whistle echoing through the valley.
            The neon lights of the city glowed brightly against the night sky.
            She ran her fingers along the spines of the books on the shelf.
            A mysterious figure stood at the end of the foggy street.
            The fire crackled in the fireplace, casting a warm glow in the room.
            The ice cubes clinked against the glass as he took a slow sip.
            She whispered something under her breath before turning away.
            The old wooden bridge creaked under his weight as he crossed.
            A soft drizzle began to fall, dampening the dusty pavement.
            The painting hung crookedly on the wall, its colors fading with time.
            The detective examined the footprints closely, deep in thought.
            She turned the key in the lock, holding her breath as the door creaked open.
            A sudden gust of wind scattered the papers across the table.
            The campfire crackled as sparks rose into the night sky.
            The radio played a song from decades ago, filling the room with nostalgia.
            A squirrel darted up the tree, disappearing into the dense foliage.
            She carefully stitched the fabric together, lost in concentration.
            The roller coaster clattered up the steep track, anticipation building.
            A gentle knock on the door interrupted her train of thought.
            The clouds parted, revealing a sky full of shimmering stars.
            He carefully arranged the chess pieces, planning his next move.
            The air smelled of pine and damp earth after the morning rain.
            The old bicycle leaned against the fence, its tires slightly deflated.
            A firefly flickered in the darkness, briefly illuminating the night.
            The bakery windows were fogged up from the warmth inside.
            A forgotten melody played in the back of his mind, familiar yet distant.
            She ran barefoot through the grass, feeling the earth beneath her feet.
            The moon cast long shadows across the empty parking lot.
            He shuffled the deck of cards with practiced ease.
            The canoe drifted lazily down the slow-moving river.
            A row of candles flickered on the windowsill, their light dancing.
            The mechanic wiped the grease from his hands and sighed.
            A rabbit darted across the path, disappearing into the underbrush.
            The elevator doors slid open with a soft chime.
            The wind carried the scent of fresh flowers from the garden.
            The bookstore was filled with the quiet rustling of pages being turned.
            A violin played softly in the background, adding to the atmosphere.
            The rusty gate creaked as he pushed it open.
            The soft hum of a ceiling fan filled the quiet room.
            The soccer ball rolled to a stop at the edge of the field.
            The mailman whistled as he placed the letters in the mailbox.
            A drop of water fell from the leaky faucet, echoing in the sink.
            She tied the ribbon carefully, making sure the bow was perfect.
            The mountain peaks were shrouded in mist, barely visible.
            A shooting star streaked across the night sky in a brilliant flash.
            The subway car rocked gently as it sped through the tunnels.
            The black cat watched him curiously from its perch on the windowsill.
            A distant church bell rang, signaling the end of the hour.
            The tea kettle whistled, steam curling into the air.
            The old rocking chair creaked with every gentle movement.
            He adjusted his glasses and squinted at the tiny print in the book.
            The children chased each other through the park, their laughter ringing out.
            The echo of footsteps in the empty corridor sent a chill down his spine.
            A spider dangled from a single thread of silk, swaying slightly.
            The aroma of fresh coffee was enough to wake him up completely.
            She carefully arranged the chessboard, ready for another game.
            The old train station had an air of nostalgia, frozen in time.
            A layer of frost covered the grass, shimmering in the morning light.
            The lighthouse stood tall against the crashing waves.
            She traced a heart in the fogged-up window with her finger.
            The clouds gathered ominously, promising a heavy downpour.
            A lone street performer played the violin, his melody hauntingly beautiful.
            The grandfather clock chimed, marking the passage of another hour.
            The market was alive with the chatter of vendors and customers.
            He absentmindedly drummed his fingers on the wooden table.
            The scent of lavender and vanilla lingered in the air.
            A single candle flickered in the dark, barely illuminating the room.
            The river flowed smoothly over the rocks, creating a soothing sound.
            She wrapped the scarf tightly around her neck, bracing against the cold.
            The empty swing swayed gently in the breeze, creaking softly.
            A pigeon fluttered down to peck at the crumbs on the pavement.
            `;

        // Create RiTa markov model (2, or 3, or 4)
        let markov = RiTa.markov(3);
        
        // Load the text into the model
        markov.addText(text);
        
        // Generate and display sentences
        const outputDiv = document.getElementById('output');
        for (let i = 0; i < 1; i++) {
            const sentence = markov.generate();
            const p = document.createElement('p');
            p.textContent = sentence;
            outputDiv.appendChild(p);
        }