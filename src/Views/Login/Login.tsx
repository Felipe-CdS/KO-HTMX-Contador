import BaseHTML from '../BaseHTML'

function LoginView(props: { messages: any }) {
    return (
        <BaseHTML>
            <div class="flex flex-col items-center justify-center rounded bg-white px-2 py-5">
                <img class="mb-1 h-12 w-12" src="./assets/cropped-audicent_logo-192x192.png" />
                <h3 class="w-4/5 text-center text-xl font-bold">
                    Envio de informações financeiras
                </h3>
                <form class="mb-0">
                    <div class="mt-1 flex w-full flex-col items-center justify-center">
                        <label for="email">Email:</label>
                        <input
                            type="text"
                            class="h-10 w-full rounded-sm border-0 bg-gray-200 p-1"
                            name="email"
                        />
                    </div>

                    <div class="mt-1 flex w-full flex-col items-center justify-center">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            class="h-10 w-full rounded-sm border-0 bg-gray-200 p-1"
                            name="password"
                        />
                    </div>

                    <div class="mt-4 flex w-full flex-col items-center justify-center">
                        <span id="login-error"></span>
                        <button class="h-14 w-14 rounded-xl bg-black">
                            <img class="h-full w-full invert" src="./assets/arrow-right.svg" />
                        </button>
                    </div>
                </form>
            </div>
        </BaseHTML>
    )
}

export default LoginView
