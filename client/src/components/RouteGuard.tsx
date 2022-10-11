import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearPlaylist } from '../storage/PlaylistSlice/PlaylistSlice';
import { useLazyGetMeQuery } from '../storage/ApiSlice/UserApi';
import { setUser, signIn } from '../storage/UserSlice/UserSlice';

export { RouteGuard };

function RouteGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const dispatch = useAppDispatch();
    const [getMe] = useLazyGetMeQuery()

    useEffect(() => {
        authCheck(router.asPath);
        const hideContent = () => setAuthorized(false);

        router.events.on('routeChangeStart', hideContent);
        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

    }, []);



    async function authCheck(url) {
        const publicPaths = ['/authorization', "/"];
        const path = url.split('?')[0];
        await getMe({}).then(res => {
            dispatch(setUser(res.data))
            if (res.isSuccess || publicPaths.includes(path)) {
                setAuthorized(true);
            } else {
                router.push('/authorization');
                dispatch(clearPlaylist());
                setAuthorized(false);
            }
        })
    }

    return (authorized && children);
}