import { v4 as uuidv4 } from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drink from 'App/Models/Drink'
import Application from '@ioc:Adonis/Core/Application'

export default class DrinksController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()
    const image = request.file('image', this.validationOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })
      body.image = imageName
    }
    const drink = await Drink.create(body)
    response.status(201)
    return {
      message: 'Bebida cadastrada com sucesso',
      data: drink,
    }
  }
  public async index() {
    const drinks = await Drink.all()
    return {
      data: drinks,
    }
  }
  public async show({ params }: HttpContextContract) {
    const drink = await Drink.findOrFail(params.id)
    return {
      data: drink,
    }
  }
  public async destroy({ params }: HttpContextContract) {
    const drink = await Drink.findOrFail(params.id)
    await drink.delete()
    return {
      message: 'Bebida excluido com sucesso',
      data: drink,
    }
  }
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const drink = await Drink.findOrFail(params.id)
    drink.name = body.name
    drink.category = body.category
    drink.description = body.description

    if (drink.image !== body.image || !drink.image) {
      const image = request.file('image', this.validationOptions)
      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })
        drink.image = imageName
      }
    }

    await drink.save()
    return {
      message: 'Bebida atualizada com sucesso',
      data: drink,
    }
  }
}
