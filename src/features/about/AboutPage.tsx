import { Accordion, Card, Button } from '../../design-system'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-navy-deep mb-2">О портале</h1>
      <p className="text-lg text-ink mb-8">
        Е-Паслуга — это единое место, где можно решить любые государственные вопросы онлайн, не выходя из дома.
      </p>

      {/* Блок с иконками вместо стены текста (п. #8 аудита) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: '🏠', text: 'Недвижимость' },
          { icon: '🚗', text: 'Транспорт' },
          { icon: '👨‍👩‍👧', text: 'Семья' },
          { icon: '💼', text: 'Работа' },
        ].map(item => (
          <Card key={item.text} className="items-center text-center p-6 bg-soft">
            <span className="text-3xl mb-2">{item.icon}</span>
            <span className="text-sm font-semibold text-navy-deep">{item.text}</span>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold text-navy-deep mb-4">Частые вопросы</h2>
      
      <div className="mb-8">
        <Accordion title="Что такое Е-Паслуга?" defaultOpen>
          Это государственный портал, который позволяет подать заявление на получение госуслуг в электронном виде. 
          Вместо похода в министерство, вы заполняете форму на сайте.
        </Accordion>
        <Accordion title="Как войти и активировать кабинет?">
          <p className="mb-3">Для входа понадобится ID-карта и PIN-код.</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Вставьте карту в картридер или приложите к телефону (если есть NFC).</li>
            <li>Введите PIN 1.</li>
            <li>Если вы здесь впервые, кабинет активируется автоматически.</li>
          </ul>
          <Link to="/login">
            <Button className="w-full md:w-auto">Войти и активировать</Button>
          </Link>
        </Accordion>
        <Accordion title="Что делать, если не получается войти?">
          Проверьте, включен ли NFC на телефоне, и правильно ли вы вводите PIN-код. 
          Если проблема не решается, <Link to="/support" className="text-navy underline">напишите в поддержку</Link> — мы поможем даже без входа в кабинет.
        </Accordion>
      </div>
    </div>
  )
}