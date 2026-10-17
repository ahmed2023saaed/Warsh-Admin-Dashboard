import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

export default function NotAllowed() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC] text-[#D64545]">
          <ShieldX size={32} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#1C1712]">Access Denied</h1>

        <p className="mt-2 text-sm leading-6 text-[#8A8074]">
          You don't have permission to access this page.
        </p>

        <Button
          onClick={() => navigate('../')}
          className="mt-5 !border-[#1C1712] !bg-[#1C1712] !px-5 !py-2.5 !text-sm !text-white hover:!bg-[#2A211C]"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
