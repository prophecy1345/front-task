<template>
    <div class="flex items-center gap-4">
        <div
            :class="{
                'max-w-xs max-h-xs overflow-hidden rounded-full w-[80px] h-[80px] p-[4px]': true,
                'border border-[#3D06D7]': isFocused,
                'bg-gray-300': !student.image,
            }"
        >
            <img
                v-if="student.image"
                :src="student.image"
                :alt="student.name"
                class="w-full h-full object-cover rounded-full"
            />
        </div>
        <div class="flex flex-col justify-center">
            <h3 :class="['name', { 'focused-name': isFocused }]">
                {{ student.name.toUpperCase() }} IS
            </h3>
            <div class="flex gap-2 items-center mt-1.5">
                <input
                    ref="inputRef"
                    v-model="formattedAge"
                    :id="id"
                    :class="['custom-input', inputClass]"
                    type="text"
                    @input="onInput"
                    @focus="onFocus"
                    @blur="onBlur"
                />
                <div class="text">
                    {{ text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, computed, defineProps, ref, onMounted, watch } from 'vue';

    interface Student {
        name: string;
        age: number | null;
        image: string | null;
    }

    const props = defineProps<{
        name: string;
        id: string;
        image?: string;
        text?: string;
    }>();

    const student = reactive<Student>({
        name: props.name,
        age: null,
        image: props.image || null,
    });

    const inputRef = ref<HTMLInputElement | null>(null);
    const formattedAge = ref<string>('');
    const isFocused = ref<boolean>(false);

    const inputClass = computed(() => ({
        'adaptive-input': isFocused.value,
        'blurred-input': !isFocused.value,
    }));

    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const parseNumber = (value: string) => {
        return value.replace(/\s/g, '');
    };

    const onInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        let rawValue = target.value.replace(/[^\d\s]/g, '');
        const parsedValue = parseNumber(rawValue);
        const formattedValue = formatNumber(parsedValue);
        formattedAge.value = formattedValue;
        student.age = parseInt(parsedValue, 10) || null;
        adjustWidth();
    };

    const onFocus = () => {
        isFocused.value = true;
    };

    const onBlur = () => {
        isFocused.value = false;
    };

    const adjustWidth = () => {
        if (inputRef.value) {
            const paddingLeft = parseInt(window.getComputedStyle(inputRef.value).paddingLeft) || 0;
            const paddingRight = parseInt(window.getComputedStyle(inputRef.value).paddingRight) || 0;
            const borderLeft = parseInt(window.getComputedStyle(inputRef.value).borderLeftWidth) || 0;
            const borderRight = parseInt(window.getComputedStyle(inputRef.value).borderRightWidth) || 0;

            const totalHorizontalPadding = paddingLeft + paddingRight + borderLeft + borderRight;

            inputRef.value.style.width = '72px';
            const tempSpan = document.createElement('span');
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.style.font = window.getComputedStyle(inputRef.value).font;
            tempSpan.textContent = formattedAge.value || inputRef.value.placeholder || '';
            document.body.appendChild(tempSpan);
            const width = Math.max(tempSpan.offsetWidth + totalHorizontalPadding, 72);
            inputRef.value.style.width = `${width}px`;
            document.body.removeChild(tempSpan);
        }
    };

    onMounted(() => {
        adjustWidth();
    });

    watch(
        () => student.age,
        () => {
            formattedAge.value = student.age !== null ? formatNumber(student.age.toString()) : '';
        }
    );
</script>

<style scoped>
    .custom-input {
        min-width: 72px;
        width: auto;
        height: 44px;
        padding: 8px 11px;
        border-radius: 8px;
        background-color: transparent;
        border: 1.5px solid #CFCADF;
        outline: none;
        box-shadow: none;
        box-sizing: border-box;
        text-align: center;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 18px;
    }

    .adaptive-input {
        border-color: #906FEE;
        color: #1E0E4C;
    }

    .blurred-input {
        border-color: #CFCADF;
        color: #CFCADF;
    }

    .name {
        font-family: 'Koulen', sans-serif;
        font-weight: 400;
        font-size: 16px;
        line-height: 15px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: #1E0E4C;
        margin-bottom: 6px;
    }

    .focused-name {
        color: #3D06D7;
    }

    .text {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        font-size: 18px;
        line-height: 21.78px;
        color: #1E0E4C;
    }
</style>