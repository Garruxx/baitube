import type { sendMessage } from '../types/send-message.type'
import type { Song } from '../types/song.type'

export const sendSongResult = (
	song: Song,
	to: string,
	sendMessage: sendMessage
) => {
	if (!song?.title) return
	const { title, id, watchId, duration } = song
	const artists = song.artists.map((ar) => ar.name).join(', ')
	const artistsLabel = song.artists.length > 1 ? '*Artistas*:' : '*Artista*:'
	return sendMessage(to, {
		image: {
			url: `https://i.ytimg.com/vi/${song.id || song.watchId}/0.jpg`,
		},
		caption: `\
			*Nombre*: ${title}
			${artistsLabel} ${artists}
			*YouTube*: https://youtu.be/${id || watchId}
			*Duración*: ${duration}

			_Responde a este mensaje con *descargar canción*  o *descargar video* para descargarlo_\
		`.replace(/\t*/gm, ''),
	})
}
