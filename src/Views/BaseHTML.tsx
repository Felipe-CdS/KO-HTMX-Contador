function BaseHTML(props: { children: any }) {
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="icon"
                    type="image/x-icon"
                    href="./assets/cropped-audicent_logo-32x32.png"
                />
                {/* <link href="./assets/tailwind.css" rel="stylesheet" /> */}
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/htmx.org@1.9.3"></script>
                <script
                    defer
                    src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"
                ></script>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
                <title>Audicent</title>
            </head>
            <body
                class="relative flex h-[100dvh] w-full flex-col items-center justify-start overflow-hidden font-['Montserrat']"
                style="background-image: linear-gradient(to top,  #8ebdd0, #b6d7e5, #ddf1fa);"
            >
                {props.children}
            </body>
        </html>
    )
}

export default BaseHTML
