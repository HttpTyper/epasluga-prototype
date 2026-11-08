import { Accordion, Card, Button } from '../../design-system'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">О портале</h1>
        <p className="text-lg text-ink">
          Е-Паслуга — единое место, где можно решить государственные вопросы онлайн, не выходя из дома.
        </p>
      </div>

      {/* Блок с иконками (эвристика #8) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: '🏠', text: 'Недвижимость' },
          { icon: '🚗', text: 'Транспорт' },
          { icon: '👨‍👩‍👧', text: 'Семья' },
          { icon: '💼', text: 'Работа' },
        ].map((item) => (
          <Card key={item.text} className="items-center text-center p-5 bg-soft border-0">
            <span className="text-3xl mb-2">{item.icon}</span>
            <span className="text-sm font-semibold text-navy-deep">{item.text}</span>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold text-navy-deep mb-4">Частые вопросы</h2>

      <div className="space-y-2">
        <Accordion title="Что такое Е-Паслуга?" defaultOpen>
          <p className="mb-3">
            Это государственный портал, который позволяет подать заявление на получение госуслуг в электронном виде. 
            Вместо похода в министерство, вы заполняете форму на сайте.
          </p>
        </Accordion>
        
        <Accordion title="Как войти и активировать кабинет?">
          <p className="mb-3">Для входа понадобится ID-карта и PIN-код.</p>
          <ul className="list-disc pl-5 space-y-1 mb-5">
            <li>Вставьте карту в картридер или приложите к телефону (если есть NFC).</li>
            <li>Введите <strong>PIN 1</strong> (не PIN 2 и не PUK).</li>
            <li>Если вы здесь впервые, кабинет активируется автоматически.</li>
          </ul>
          <Link to="/login">
            <Button className="w-full md:w-auto">Войти и активировать</Button>
          </Link>
        </Accordion>
        
        <Accordion title="Что делать, если не получается войти?">
          <p className="mb-3">
            Проверьте, включен ли NFC на телефоне, и правильно ли вы вводите PIN-код. 
            Если проблема не решается, обратитесь в поддержку.
          </p>
          <Link to="/support">
            <Button variant="ghost">Написать в поддержку</Button>
          </Link>
        </Accordion>
      </div>
    </div>
  )
}