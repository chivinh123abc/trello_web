import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import { Card as MuiCard } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupsIcon from '@mui/icons-material/Groups'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (<MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
      overflow: 'unset'
    }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography >
          Card Test 01
        </Typography>
      </CardContent>
    </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://i.pinimg.com/736x/d7/a6/0d/d7a60da66d05c6d2af9d887a6a73d4e8.jpg"
        title="XinXinCute"
      />

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography >
          XinXin So Cute
        </Typography>
      </CardContent>

      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupsIcon />}>20</Button>
        <Button size="small" startIcon={<CommentIcon />}>15</Button>
        <Button size="small" startIcon={<AttachmentIcon />}>8</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card
