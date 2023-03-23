/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint linebreak-style: ["error", "windows"]*/
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { getCookie, setCookie } from 'cookies-next';
import NextApp, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { Analytics } from '@vercel/analytics/react';
import MainLayout from '../components/Layouts/MainLayout';
import { store } from '../redux/store';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>NoteRep Forum - MSRIT</title>
        <meta
          name="description"
          content="Connecting Collegiate Ideas through Our Community Forum."
          // content="Connecting College Students Thoughts through Community Forum"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />
        <meta name="application-name" content="Noterep Forum" />
        <meta name="apple-mobile-web-app-title" content="Noterep Forum" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="shortcut icon" href="/noterep-logo.png" />
        <meta name="keywords" content="Noterep, Noterep Forum, Noterep Community" />
        <meta name="author" content="Noterep Forum" />
      </Head>

      <Provider store={store}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <NotificationsProvider>
              <MainLayout key={router.asPath}>
                <Component key={router.asPath} {...pageProps} />
              </MainLayout>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Provider>
      <Analytics />
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
