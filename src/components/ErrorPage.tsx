import { Button, Result } from 'antd'
import { useNavigate, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError()
  console.error(error)

  return (
    <Result
      status="500"
      title="500"
      subTitle="对不起，服务器发生了错误。"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
}
