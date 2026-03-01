import type { Metadata } from 'next';
import AppClient from '../components/AppClient';

export const metadata: Metadata = {
    title: 'Bone Battle Card Creator',
    description: 'Create your custom Bone Battle TCG card. Set your stats, upload your photo, and join the pack.',
};

export default function Page() {
    return <AppClient />;
}
