<template>
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none w-full h-full" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        default: 50
    },
    color: {
        type: String,
        default: 'white'
    },
    minRadius: {
        type: Number,
        default: 1
    },
    maxRadius: {
        type: Number,
        default: 3
    },
    minSpeed: {
        type: Number,
        default: 0.5
    },
    maxSpeed: {
        type: Number,
        default: 2
    }
});

const canvasRef = ref(null);
let animationFrameId;
let dots = [];

const initDots = (width, height) => {
    const newDots = [];
    for (let i = 0; i < props.count; i++) {
        newDots.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * (props.maxRadius - props.minRadius) + props.minRadius,
            speed: Math.random() * (props.maxSpeed - props.minSpeed) + props.minSpeed
        });
    }
    return newDots;
};

const drawDots = (ctx, dotsToDraw) => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = props.color;

    dotsToDraw.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
    });
};

const updateDots = (dotsToUpdate, width, height) => {
    return dotsToUpdate.map((dot) => {
        let y = dot.y - dot.speed;
        let x = dot.x;

        // Reset position when dot goes off the top
        if (y < -dot.radius * 2) {
            y = height + dot.radius;
            x = Math.random() * width;
        }

        return {
            ...dot,
            x,
            y
        };
    });
};

const animate = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    dots = updateDots(dots, width, height);
    drawDots(ctx, dots);

    animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();

    // Set logical size matches display size
    canvas.width = width;
    canvas.height = height;

    // Reinitialize dots if needed or just keep them
    // The React version re-inits dots on resize, so we will too
    dots = initDots(width, height);
};

onMounted(() => {
    handleResize();
    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', handleResize);
});

// Watch for prop changes to re-init
watch(() => [props.count, props.maxRadius, props.minRadius, props.maxSpeed, props.minSpeed], () => {
    const canvas = canvasRef.value;
    if (canvas) {
        dots = initDots(canvas.width, canvas.height);
    }
});
</script>
