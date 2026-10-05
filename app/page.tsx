import type { Metadata } from 'next';
import AppClient from '../components/AppClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Bone Battle Card Preview & Submission',
    description: 'Preview your BoneBattle card and submit your information. An approved card creator makes the final official card.',
};

export default function Page() {
    return <AppClient />;
}
