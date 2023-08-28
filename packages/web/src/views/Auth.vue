<template>
    <!--
      This example requires updating your template:
  
      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    -->
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST">
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div class="mt-2">
                        <j-input :value="email" @input="handleChange" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div class="mt-2">
                        <j-input :value="password" @input="handleChange" />
                    </div>
                    <div class="text-sm">
                        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>
                </div>

                <div>
                    <j-button :isWorking="isWorking" @click="handleConfirmed" class="mr-2">Sign
                        in</j-button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, defineComponent, onUnmounted } from 'vue'
export default defineComponent({
    //   props: {
    //     title: {
    //       type: String,
    //       required: true
    //     },
    //     message: {
    //       type: String,
    //       default: undefined
    //     },
    //     confirmText: {
    //       type: String,
    //       default: 'Confirm'
    //     },
    //     variant: {
    //       type: String,
    //       default: 'primary'
    //     }
    //   },
    setup(_, { emit }) {
        const isWorking = ref<boolean>(false);
        const email = ref<string>('');
        const password = ref<string>('');
        const handleConfirmed = () => {
            if (isWorking.value) return
            isWorking.value = true
            emit('confirm')
        }
        const handleClose = () => emit('close')

        onUnmounted(() => {
            isWorking.value = false
        })

        const handleChange = (e) => {
            console.log("email>>", e);
        }

        return {
            isWorking,
            handleClose,
            handleConfirmed,
            handleChange,
            email,
            password
        }
    }
})
</script>