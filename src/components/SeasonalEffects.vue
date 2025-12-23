<template>
    <div v-if="currentMonth === 11" class="seasonal-effect">
        <div class="snowflakes" aria-hidden="true">
            <div v-for="i in 50" :key="i" class="snowflake" :class="darkMode ? 'snowflake-dark' : 'snowflake-light'"
                :style="getSnowflakeStyle(i)">
                ❅
            </div>
        </div>
    </div>

    <div v-if="currentMonth === 10" class="seasonal-effect">
        <div class="halloween-effects" aria-hidden="true">
            <div v-for="i in 8" :key="`pumpkin-${i}`" class="floating-pumpkin" :style="getPumpkinStyle(i)">
                🎃
            </div>
            <div v-for="i in 6" :key="`ghost-${i}`" class="floating-ghost" :style="getGhostStyle(i)">
                👻
            </div>
            <div v-for="i in 10" :key="`bat-${i}`" class="floating-bat" :style="getBatStyle(i)">
                🦇
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    darkMode: {
        type: Boolean,
        default: false
    }
});

const currentMonth = ref(new Date().getMonth());

const getSnowflakeStyle = (index) => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 10;
    const randomDuration = 10 + Math.random() * 20;
    const randomSize = 0.5 + Math.random() * 1;

    return {
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        fontSize: `${randomSize}rem`,
        opacity: 0.3 + Math.random() * 0.7
    };
};

const getPumpkinStyle = (index) => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 8;
    const randomDuration = 15 + Math.random() * 15;
    const randomSize = 1.5 + Math.random() * 1.5;

    return {
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        fontSize: `${randomSize}rem`
    };
};

const getGhostStyle = (index) => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 6;
    const randomDuration = 12 + Math.random() * 12;
    const randomSize = 1.2 + Math.random() * 1.3;

    return {
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        fontSize: `${randomSize}rem`
    };
};

const getBatStyle = (index) => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 10;
    const randomDuration = 8 + Math.random() * 12;
    const randomSize = 0.8 + Math.random() * 1;

    return {
        left: `${randomLeft}%`,
        animationDelay: `${randomDelay}s`,
        animationDuration: `${randomDuration}s`,
        fontSize: `${randomSize}rem`
    };
};

onMounted(() => {
    currentMonth.value = new Date().getMonth();
});
</script>

<style scoped>
.seasonal-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
}

.snowflakes {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 110%;
}

.snowflake {
    position: absolute;
    top: -10%;
    user-select: none;
    animation: fall linear infinite;
}

/* Dark mode snowflakes - white */
.snowflake-dark {
    color: #fff;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

/* Light mode snowflakes - dark blue/gray */
.snowflake-light {
    color: #1e3a8a;
    text-shadow: 0 0 5px rgba(30, 58, 138, 0.6);
}

@keyframes fall {
    0% {
        transform: translateY(-10vh) rotate(0deg);
    }

    100% {
        transform: translateY(110vh) rotate(360deg);
    }
}

.halloween-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.floating-pumpkin {
    position: absolute;
    top: -10%;
    animation: float-down linear infinite;
    filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.6));
}

.floating-ghost {
    position: absolute;
    top: -10%;
    animation: float-zigzag linear infinite;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.floating-bat {
    position: absolute;
    top: -10%;
    animation: bat-fly linear infinite;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.8));
}

@keyframes float-down {
    0% {
        transform: translateY(-10vh) rotate(0deg);
    }

    100% {
        transform: translateY(110vh) rotate(360deg);
    }
}

@keyframes float-zigzag {
    0% {
        transform: translateY(-10vh) translateX(0);
    }

    25% {
        transform: translateY(25vh) translateX(30px);
    }

    50% {
        transform: translateY(50vh) translateX(-30px);
    }

    75% {
        transform: translateY(75vh) translateX(30px);
    }

    100% {
        transform: translateY(110vh) translateX(0);
    }
}

@keyframes bat-fly {
    0% {
        transform: translateY(-10vh) translateX(0) rotate(0deg);
    }

    20% {
        transform: translateY(20vh) translateX(-50px) rotate(-15deg);
    }

    40% {
        transform: translateY(40vh) translateX(50px) rotate(15deg);
    }

    60% {
        transform: translateY(60vh) translateX(-30px) rotate(-10deg);
    }

    80% {
        transform: translateY(80vh) translateX(40px) rotate(10deg);
    }

    100% {
        transform: translateY(110vh) translateX(0) rotate(0deg);
    }
}
</style>
