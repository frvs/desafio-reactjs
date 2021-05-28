import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { isObjectBindingPattern } from 'typescript'
import { GithubUser, Repository } from '../../types'

interface paramsProps {
  id: string
}

function nonNull(obj: Repository[] | null): Repository[] {
  if (obj == null) {
    throw new Error('deu merda')
  }

  return obj
}
const totalRepositoryStars = (repositories: Repository[] | null): number => {
  return Object.values(nonNull(repositories)).reduce((t, { stargazers_count }) => t + stargazers_count, 0)
}

const User = () => {
  const { id } = useParams<paramsProps>()
  const [user, setUser] = useState<GithubUser | null>(null)
  const [repositories, setRepositories] = useState<Array<Repository> | null>(null)
  // TODO: remover ! abaixo
  useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        // TODO: pesquisar types para método .json()
        return res.json()
      })
      .then((ghUser) => {
        setUser(ghUser)
      })
      .catch((error) => console.log('error: ' + error))
    // TODO: verificar se o warning realmente acontece em prod
  }, [id])

  useEffect(() => {
    fetch(`https://api.github.com/users/${user?.login}/repos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }
        return res.json()
      })
      .then((repos) => {
        setRepositories(repos)
      })
      .catch((error) => console.log('error: ' + error))
  }, [user])

  return (
    <div>
      <section>
        <img src={user?.avatar_url} alt="perfil"></img>
        <p>{user?.bio}</p>
        <span>
          <p>{user?.followers}</p>
          <p>{user?.following}</p>
          <p>{repositories == null ? 0 : totalRepositoryStars(repositories)}</p>
        </span>
        <div>
          <p>{user?.company}</p>
        </div>
        <div>
          <p>{user?.location}</p>
        </div>
        <div>
          <p>{user?.email}</p>
        </div>
        <div>
          <p>
            <a href={user?.blog} target="_blank" rel="noreferrer">
              {user?.blog}
            </a>
          </p>
        </div>
        <div>
          <p>
            <a href={`https://twitter.com/${user?.twitter_username}`} target="_blank" rel="noreferrer">
              {user?.twitter_username}
            </a>
          </p>
        </div>
        <div>
          <button>
            <Link to="/">Voltar</Link>
          </button>
        </div>
      </section>
      <section>
        {repositories &&
          repositories
            ?.sort((a, b) => (a.stargazers_count > b.stargazers_count ? -1 : 1))
            .map((val) => (
              <div key={val.id}>
                <h1>
                  <a href={`https://github.com/${val.full_name}`}>{val.name}</a>
                </h1>
                <p>{val.description}</p>
                <span>
                  <p>{val.stargazers_count}</p>
                  <p>{getDaysFrom(val.updated_at)}</p>
                </span>
              </div>
            ))}
      </section>
    </div>
  )
}

export default User

function getDaysFrom(updated_at: Date): number {
  const now = new Date(Date.now())

  return Math.abs(now.valueOf() - updated_at.valueOf()) / (1000 * 60 * 60 * 24)
}
