import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBackground from '../../../components/layout/PageBackground';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { getPollByShareCode } from '../shareApi';

const isUsableId = (value) => {
  if (value === undefined || value === null) return false;

  const id = String(value).trim();
  return id !== '' && id !== 'undefined' && id !== 'null';
};

const extractPollId = (response) => {
  const body = response?.data ?? response;

  const candidates = [
    body?.pollId,
    body?.id,
    body?._id,
    body?.data?.pollId,
    body?.data?.id,
    body?.data?._id,
    body?.poll?.pollId,
    body?.poll?.id,
    body?.poll?._id,
    body?.data?.poll?.pollId,
    body?.data?.poll?.id,
    body?.data?.poll?._id,
  ];

  const pollId = candidates.find(isUsableId);
  return pollId ? String(pollId) : null;
};

export default function SharePage() {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      try {
        const res = await getPollByShareCode(shareCode);
        if (cancelled) return;

        const pollId = extractPollId(res);
        if (!pollId) throw new Error('Poll ID missing in response');

    // Log the final link
    console.log('Navigating to:', window.location.origin + '/poll/' + pollId);


        localStorage.setItem('returnUrl', `/poll/${pollId}`);
        navigate(`/poll/${pollId}`, { replace: true });
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Invalid or expired share link');
        }
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, [shareCode, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <PageBackground />

      <div className="relative z-10 w-full max-w-sm mx-auto px-5">
        {!error ? (
          /* Loading state */
          <div className="flex flex-col items-center gap-6">
            <Spinner variant="inline" />
            <p className="font-hanken-grotesk text-on-surface-variant text-sm">
              Resolving share link…
            </p>
          </div>
        ) : (
          /* Error state */
          <Card elevated className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <span
                className="material-symbols-outlined text-error"
                style={{ fontSize: '3rem', fontVariationSettings: "'FILL' 1" }}
              >
                link_off
              </span>
            </div>

            <h1 className="font-sora text-xl font-bold text-on-surface mb-2">
              Link Not Found
            </h1>

            <p className="font-hanken-grotesk text-on-surface-variant text-sm mb-6">
              {error}
            </p>

            <Button
              variant="brand"
              icon="home"
              onClick={() => navigate('/auth', { replace: true })}
            >
              Go Home
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
