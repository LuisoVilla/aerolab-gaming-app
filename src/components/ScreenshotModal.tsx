import { Box, Modal } from '@mui/material';
import Image from 'next/image';
import { GRAY_DARK } from '@/lib/constants/colors';

interface ScreenshotModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ScreenshotModal({ open, onClose, imageUrl }: ScreenshotModalProps) {
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 2000 }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: GRAY_DARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90vw', md: '70vw' },
            height: { xs: '60vw', md: '56vw' },
            minWidth: 320,
            minHeight: 180,
            maxWidth: '100vw',
            maxHeight: '80vh',
            boxShadow: 6,
            borderRadius: 3,
            overflow: 'hidden',
            background: '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={imageUrl}
            alt="Screenshot"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 600px) 90vw, 70vw"
            priority={true}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={onClose}
            aria-label="Close modal"
          >
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>&times;</span>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
