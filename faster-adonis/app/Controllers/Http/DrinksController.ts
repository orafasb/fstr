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
    try {
    const body = request.body()
    const image = request.file('image', this.validationOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })
      body.image = imageName
      const drink = await Drink.create(body)
      response.status(201)
      return {
        message: 'Bebida cadastrada com sucesso',
        data: drink,
      }
    }else {
      response.status(400)
      return {
        message: 'Você precisa enviar uma imagem',
      }
    }
    } catch (error) {
      response.status(500)
    return {
      message: `${error}`,
        }
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
  public async update({ params, request, response }: HttpContextContract) {
    try {  
    const body = request.body()
    const drink = await Drink.findOrFail(params.id)
    if(body.name){
      drink.name = body.name
    }
    if(body.category){
      drink.category = body.category
    }
    if(body.description){
      drink.description = body.description
    }
    
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
    response.status(200)
    return {
      message: 'Bebida atualizada com sucesso',
      data: drink,
    }
    } catch (error) {
      response.status(500)
      return {
        message: error
      }
    }
    
  }
}
