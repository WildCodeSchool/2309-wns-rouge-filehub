import { theme } from '@/styles/theme';
import ImageIcon from '@mui/icons-material/Image';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import AudioFileIcon from '@mui/icons-material/AudioFile';

export const showLogo = (mimeType: string, size: number)=>{
    return (
      <>
        {mimeType.includes("pdf") &&
          <img src='/pdf-icon.svg' alt='pdf' style={{
            height: size,
            width: size
          }}/>
        }
        {(mimeType.includes('ms-excel') || 
        mimeType.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) &&
          <img src='/excel-icon.svg' alt='pdf' style={{
            height: size,
            width: size
          }}/>
        }
        {(mimeType.includes("application/msword") || 
        mimeType.includes("vnd.openxmlformats-officedocument.wordprocessingml.document")) &&
          <img src='/word-icon.svg' alt='pdf' style={{
            height: size,
            width: size
          }}/>
        }
        {(mimeType.includes("application/vnd.ms-powerpoint") || 
        mimeType.includes("application/vnd.openxmlformats-officedocument.presentationml.presentation")) &&
          <img src='/powerpoint-icon.svg' alt='pdf' style={{
            height: size,
            width: size
          }}/>
        }
        {mimeType.includes("text/plain") &&
          <img src='/txt-icon.svg' alt='pdf' style={{
            height: size,
            width: size
          }}/>
        }
        {mimeType.includes("image") &&
          <ImageIcon sx={{
            color: theme.palette.primary.dark,
            height: size,
            width: size
          }}/>
        }
        {mimeType.includes("video") &&
          <VideoCameraBackIcon sx={{
            color: theme.palette.primary.dark,
            height: size,
            width: size
          }}/>
        }
        {mimeType.includes("audio") &&
          <AudioFileIcon sx={{
            color: theme.palette.primary.dark,
            height: size,
            width: size
          }}/>
        }
      </>
    )
}